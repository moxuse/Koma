const sc = require('supercolliderjs');
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
  blockSize?: string;
  device?: string;
}

export default class SCSynth {
  mode: SCSynthMode;
  private eventId = 0;
  private nodeId = 8000;
  private bufnum = 600;
  private socket;
  private server: any;
  private options: ServerOptions;
  private listennersRemote: Array<{ id: number; name: string; event: SCSynthEvent }>;
  private listennersInternal: Array<{ id: number; name: string; event: SCSynthEvent }>;
  private udpPort = 8000;

  constructor(options: ServerOptions) {
    this.mode = 'remote';
    this.socket = dgram.createSocket('udp4');
    this.socket.bind(this.udpPort, 'localhost');
    this.listennersRemote = [];
    this.listennersInternal = [];
    this.options = options;
  }

  /**
   * getter for gloabal Ids
   */
  nextNodeId = () => {
    const next = this.nodeId;
    this.nodeId++;
    return next;
  };

  nextBufnum = () => {
    const next = this.bufnum;
    this.bufnum++;
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
    this.listennersRemote = this.listennersRemote.filter(l => {
      return l.id !== id;
    });
    this.listennersInternal = this.listennersInternal.filter(l => {
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

  allocReadBuffer(file: string, bufnum: number | null) {
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
      if (bufnum == null) {
        bufnum = this.nextBufnum();
      } else {
        this.bufnum = bufnum + 1;
      }
      this.sendMsg(['/b_allocRead', bufnum, file]);
    });
  }

  loadSynthDefFromFile(name: string, file: string) {
    return new Promise((resolve, reject) => {
      const doneId = this.subscribe('/done', (msg) => {
        this.unsubscribe(doneId);
        if (msg && msg[0] == '/d_recv') {
          resolve({ id: doneId, error: undefined });
        } else {
          reject({ id: doneId, error: new Error('maybe /fail') });
        }
      });
      if (this.mode === 'internal') {
        this.server?.loadSynthDef(name, file).catch((e: Error) => {
          reject({ id: doneId, error: e });
        });
      } else {
        reject({ id: doneId, error: new Error('server not booted at internal.') });
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
      const begin = slice.begin;
      const end = slice.end;
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

    const positions: number[] = effect.points.map(p => { return p.x; });
    const rates: number[] = effect.points.map(p => { return p.y * -1; });
    this.sendMsgWithPoints(msgPack, positions, rates);
  }

  freeBuffer(bufnum: number) {
    this.sendMsg(['/b_free', bufnum]);
  }

  async writeBufferAsWav(bufNum: number, filePath: string) {
    this.sendMsg(['/b_write', bufNum, filePath, 'wav', 'int24']);
  }

  private async tryBoot() {
    return new Promise((resolve) => {
      sc.server.boot(this.options).then(async (server: any) => {
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
      this.listennersRemote.forEach(({ name, event }) => {
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
    return this.server.receive.subscribe((msg: string[]) => {
      this.listennersInternal.forEach(({ name, event }) => {
        if (msg[0] === name) {
          msg.shift();
          event(msg);
        }
      });
    });
  }

  private subscribeRemote(address: string, callback: SCSynthEvent): number {
    const id = this.getEventId();
    this.listennersRemote.push({
      id: id,
      name: address,
      event: callback,
    });
    return id;
  }

  private subscribeInternal(address: string, callback: SCSynthEvent): number {
    const id = this.getEventId();
    this.listennersInternal.push({
      id: id,
      name: address,
      event: callback,
    });
    return id;
  }
}
