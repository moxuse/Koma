import * as dgram from 'dgram';
import * as OSC from 'osc-js';
import * as osc from '@supercollider/osc';
// import sc from 'supercolliderjs';

export type SCSynthMode = 'internal' | 'remote';

export type SCSynthEvent = (msg: string[] | osc.OscValues | undefined) => void;

export type OSCMessageArg = Array<string | number | Buffer>;

interface ServerOptions {
  sampleRate?: string;
  numBuffers?: string;
  numInputBusChannels?: number;
  numOutputBusChannels?: number;
  blockSize?: string;
  device?: string;
}

export default class SCSynth {
  mode: SCSynthMode;
  sc: any;
  private eventId = 0;
  private nodeId = 8000;
  private bufnum = 600;
  private currentRecordBufnum = 3000;
  private bufferListener = 0;
  private socket;
  private server: any;
  private options: ServerOptions;
  private listenersRemote: Array<{ id: number; name: string; event: SCSynthEvent }>;
  private listenersInternal: Array<{ id: number; name: string; event: SCSynthEvent }>;
  private udpPort = 8000;
  private isRecording = false;
  private recordingFrames = 0;
  private recordingEndId: any;
  private recordingCounter: any;

  constructor(options: ServerOptions, sc: any) {
    this.mode = 'remote';
    this.socket = dgram.createSocket('udp4');
    this.socket.bind(this.udpPort, 'localhost');
    this.listenersRemote = [];
    this.listenersInternal = [];
    this.options = options;
    this.sc = sc;
  }

  /**
   * getter for global Ids
   */
  nextNodeId = () => {
    const next = this.nodeId;
    this.nodeId++;
    return next;
  };

  nextBufnum = () => {
    const next = this.bufnum;
    this.bufnum += 1;
    return next;
  };

  getEventId = () => {
    const next = this.eventId;
    this.eventId++;
    return next;
  };

  async boot() {
    this.initRemoteListeners();
    const foundRemote = await this.checkRemoteHealth();
    if (!foundRemote) {
      return this.tryBoot();
    } else {
      return false;
    }
  }

  async checkRemoteHealth() {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => resolve(false), 3000);
      let syncedId = this.subscribeRemote('/synced', async (msg) => {
        this.unsubscribe(syncedId);
        if (msg && msg[0] === 0) {
          clearTimeout(timeout);
          resolve(true);
        }
      });
      if (this.mode === 'internal') {
        syncedId = this.subscribeInternal('/synced', async (msg) => {
          this.unsubscribe(syncedId);
          if (msg && msg[0] === 0) {
            clearTimeout(timeout);
            resolve(true);
          }
        });
      }
      this.sendMsg(['/sync']);
    });
  }

  async quit() {
    if (this.mode === 'internal') {
      return this.server.quit();
    }
    this.socket.close();
  }

  subscribe(address: string, callback: SCSynthEvent): number {
    if (this.mode === 'internal') {
      return this.subscribeInternal(address, callback);
    } else if (this.mode === 'remote') {
      return this.subscribeRemote(address, callback);
    }
    return -1;
  }

  unsubscribe(id: number): void {
    this.listenersRemote = this.listenersRemote.filter((l) => {
      return l.id !== id;
    });
    this.listenersInternal = this.listenersInternal.filter((l) => {
      return l.id !== id;
    });
  }

  sendMsg(arg: OSCMessageArg) {
    if (this.mode === 'internal') {
      this.server.send.msg(arg);
    } else if (this.mode === 'remote') {
      let address;
      if (typeof arg[0] === 'string') {
        address = arg[0].split('/')[1];
      }
      arg.shift();
      let message;
      if (arg.length >= 1) {
        message = new OSC.Message([address], ...arg);
      } else {
        message = new OSC.Message(address, []);
      }
      const binary = message.pack();
      this.socket.send(Buffer.from(binary), 0, binary.byteLength, 57110, 'localhost');
    }
  }

  sendMsgWithPoints(arg: OSCMessageArg, positions: number[], rates: number[]) {
    // if (this.mode === 'internal') {
    //   this.server.send.msg(arg);
    // } else if (this.mode === 'remote') {
    let address;
    if (typeof arg[0] === 'string') {
      address = arg[0].split('/')[1];
    }
    arg.shift();
    let message: OSC.Message;
    if (arg.length >= 1) {
      message = new OSC.Message([address], ...arg);
    } else {
      message = new OSC.Message(address, []);
    }

    message.args.push('positions');
    message.types += 's';

    message.types += '[';
    message.args.push(0);
    positions.forEach((p) => {
      message.args.push(p);
      message.types += 'i';
    });
    message.types += ']';
    message.args.push(0);

    message.args.push('rates');
    message.types += 's';

    message.types += '[';
    message.args.push(0);
    rates.forEach((p) => {
      message.args.push(p);
      message.types += 'i';
    });
    message.types += ']';
    message.args.push(0);

    const binary = message.pack();
    this.socket.send(Buffer.from(binary), 0, binary.byteLength, 57110, 'localhost');
  }

  allocReadBuffer(file: string, bufnum: number | null | undefined) {
    return new Promise((resolve, reject) => {
      const failId = this.subscribe('/fail', () => {
        this.unsubscribe(failId);
        this.unsubscribe(doneId);
        reject(new Error('/fail'));
      });
      const doneId = this.subscribe('/done', (msg) => {
        this.unsubscribe(failId);
        this.unsubscribe(doneId);
        if (msg && msg[0] === '/b_allocRead') {
          const arg = { value: msg[1] };
          resolve(arg);
        } else {
          reject(new Error('failed at /done msg'));
        }
      });
      const nextBufnum = bufnum || this.nextBufnum();
      setTimeout(() => this.sendMsg(['/b_allocRead', nextBufnum, file]), 250);
    });
  }

  loadSynthDefFromFile(name: string, file: string) {
    return new Promise((resolve, reject) => {
      const doneId = this.subscribe('/done', (msg) => {
        this.unsubscribe(doneId);
        if (msg && msg[0] === '/d_recv') {
          resolve({ id: doneId, error: undefined });
        } else {
          reject(new Error('maybe /fail'));
        }
      });
      if (this.mode === 'internal') {
        this.server?.loadSynthDef(name, file).catch((e: Error) => {
          reject(e);
        });
      } else {
        reject(new Error('server not booted at internal.'));
      }
    });
  }

  loadSynthDefFromSynthDef(path: string) {
    this.sendMsg(['/d_loadDir', path]);
  }

  playBuffer(bufnum: number,
    slice: ({ begin: number; end: number } | undefined),
    effect: { amp: number; rate: number; pan: number; gain: number }) {
    if (slice && slice.begin && slice.end) {
      const { begin, end } = slice;
      // if (effect.rate < 0) {
      //   end = slice.begin;
      //   begin = slice.end;
      // }
      this.sendMsg(['/s_new', 'bufRd', this.nextNodeId(), 1, 0,
        'bufnum', bufnum,
        'begin', begin,
        'end', end,
        'amp', effect.amp,
        'rate', effect.rate,
        'pan', effect.pan,
        'gain', effect.gain,
      ]);
    } else {
      this.sendMsg(['/s_new', 'player', this.nextNodeId(), 1, 0,
        'bufnum', bufnum,
        'amp', effect.amp,
        'rate', effect.rate,
        'pan', effect.pan,
        'gain', effect.gain,
      ]);
    }
  }

  playGrain(bufnum: number,
    slice: ({ begin: number; end: number } | undefined),
    effect: { amp: number; rate: number; pan: number; gain: number; points: Array<{ x: number; y: number }>; duration: number; trig: number; axisY: string }) {
    let begin_;
    let end_;
    if (!slice) {
      begin_ = 0; end_ = 1.0;
    } else {
      begin_ = slice.begin;
      end_ = slice.end;
    }
    const synthName = effect.axisY === 'dur' ? 'grainDur' : 'grainRate';

    const msgPack = ['/s_new', synthName, this.nextNodeId(), 1, 0,
      'bufnum', bufnum,
      'amp', effect.amp,
      'begin', begin_,
      'end', end_,
      'rate', effect.rate,
      'pan', effect.pan,
      'gain', effect.gain,
      'trig', effect.trig,
      'duration', effect.duration,
    ];

    const positions: number[] = effect.points.map((p) => { return p.x; });
    const rates: number[] = effect.points.map((p) => { return p.y * -1; });
    this.sendMsgWithPoints(msgPack, positions, rates);
  }

  freeBuffer(bufnum: number) {
    this.sendMsg(['/b_free', bufnum]);
  }

  writeBufferAsWav(bufNum: number, filePath: string, numFrames: number) {
    this.sendMsg(['/b_write', bufNum, filePath, 'wav', 'int24', numFrames, 0, 0]);
  }

  startRecord(bufnum_: number, writePath: string, callback: (msg: any) => void, onEnd: (msg: any) => void) {
    if (this.isRecording) {
      return;
    }
    this.isRecording = true;
    this.recordingFrames = 0;
    this.currentRecordBufnum = this.nextBufnum();
    this.bufferListener = this.subscribe('/buf_info', callback);
    this.recordingCounter = setInterval(() => {
      this.recordingFrames += 2205;
    }, 50);
    this.recordingEndId = this.subscribe('/n_end', () => {
      this.unsubscribe(this.recordingEndId);
      this.unsubscribe(this.bufferListener);
      clearTimeout(this.recordingCounter);
      this.writeBufferAsWav(bufnum_, writePath, this.recordingFrames);
      setTimeout(() => {
        this.freeBuffer(bufnum_);
      });
      onEnd([this.currentRecordBufnum, writePath]);
      this.isRecording = false;
    });
    this.sendMsg(['/s_new', 'recorder', 9999, 1, 0, 'bufnum', bufnum_]);
    return this.currentRecordBufnum;
  }

  stopRecord(bufnum: number, path: string) {
    this.isRecording = false;
    this.unsubscribe(this.recordingEndId);
    clearTimeout(this.recordingCounter);
    return new Promise((resolve, reject) => {
      const failId = this.subscribe('/fail', () => {
        this.unsubscribe(failId);
        this.unsubscribe(doneId);
        reject(new Error('/fail record wav :' + path));
      });
      const doneId = this.subscribe('/done', (msg) => {
        this.unsubscribe(failId);
        this.unsubscribe(doneId);
        if (msg && msg[0] === '/b_write') {
          const arg = { path: path, bufnum: this.currentRecordBufnum };
          resolve(arg);
        } else {
          reject(new Error('failed at /done msg'));
        }
      });
      this.unsubscribe(this.bufferListener);
      this.writeBufferAsWav(bufnum, path, this.recordingFrames);
      setTimeout(() => {
        this.sendMsg(['/n_free', 9999]);
        this.freeBuffer(bufnum);
      }, 50);
    });
  }

  private async tryBoot() {
    return new Promise((resolve) => {
      this.sc.server.boot(this.options).then(async (server: any) => {
        this.server = server;
        this.mode = 'internal';
        await this.initInternalListeners();
        resolve(1);
      });
    }).catch((error: Error) => {
      this.mode = 'remote';
      throw error;
    });
  }

  private initRemoteListeners() {
    this.socket.on('message', (data: Buffer) => {
      const msg = osc.unpackMessage(data);
      this.listenersRemote.forEach(({ name, event }) => {
        if (msg.address === name) {
          event(msg.args);
        }
      });
    });
    this.socket.on('error', (err) => {
      console.log(`client err: \n${err.stack}`);
    });
  }

  private async initInternalListeners() {
    this.socket.on('message', (data: Buffer) => {
      const msg = osc.unpackMessage(data);
      this.listenersInternal.forEach(({ name, event }) => {
        if (msg.address === name) {
          event(msg.args);
        }
      });
    });
    this.socket.on('error', (err) => {
      console.log(`client err: \n${err.stack}`);
    });
    return this.server.receive.subscribe((msg: string[]) => {
      this.listenersInternal.forEach(({ name, event }) => {
        if (msg[0] === name) {
          msg.shift();
          event(msg);
        }
      });
    });
  }

  private subscribeRemote(address: string, callback: SCSynthEvent): number {
    const id = this.getEventId();
    this.listenersRemote.push({
      id: id,
      name: address,
      event: callback,
    });
    return id;
  }

  private subscribeInternal(address: string, callback: SCSynthEvent): number {
    const id = this.getEventId();
    this.listenersInternal.push({
      id: id,
      name: address,
      event: callback,
    });
    return id;
  }
}
