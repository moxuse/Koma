const sc = require('supercolliderjs');
import * as dgram from 'dgram';
import * as OSC from 'osc-js';
import * as osc from '@supercollider/osc';

export type SCSynthMode = 'internal' | 'remote';

export type SCSynthEvent = (msg: string[] | osc.OscValues | undefined) => void;

type ServerOptions = {
  sampleRate?: string;
  numBuffers?: string;
  blockSize?: string;
  device?: string;
};

export default class SCSynth {
  public mode: SCSynthMode;
  private eventId: number = 0;
  private nodeId: number = 8000;
  private bufnum: number = 600;
  private socket;
  private server: any;
  private options: ServerOptions;
  private listennersRemote: Array<{ id: number, name: string, event: SCSynthEvent }>;
  private listennersInternal: Array<{ id: number, name: string, event: SCSynthEvent }>;
  private udpPort: number = 8000;

  constructor(options: ServerOptions) {
    this.mode = 'remote';
    this.socket = dgram.createSocket('udp4');
    this.socket.bind(this.udpPort, 'localhost');
    this.listennersRemote = [];
    this.listennersInternal = [];
    this.options = options;
  };

  /**
   * getter for gloabal Ids
   */
  public nextNodeId = () => {
    const next = this.nodeId;
    this.nodeId++;
    return next;
  };
      
  public nextBufnum = () => {
    const next = this.bufnum;
    this.bufnum++;
    return next;
  };

  public getEventId = () => {
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
    };
  };

  public async checkRemoteHealth() {
    return new Promise(async (resolve, reject) => {
      const timeout = setTimeout(() => resolve(false), 1000);
      let syncedId = this.subscribeRemote('/synced', async (msg) => {
        this.unsubscribe(syncedId);
        if (msg && msg[0] === 0) {
          clearTimeout(timeout);
          resolve(true);
        };
      });
      if (this.mode == 'internal') {
        syncedId = this.subscribeInternal('/synced', async (msg) => {
          this.unsubscribe(syncedId);
          if (msg && msg[0] === 0) {
            clearTimeout(timeout);
            resolve(true);
          };
        });
      };
      this.sendMsg(['/sync']);
    });
  };

  private async tryBoot() {
    return new Promise(async (resolve, reject) => {
      await sc.server.boot(this.options).then(async (server: any) => {
        this.server = server;
        this.mode = 'internal';
        await this.initInternalListeners();
        resolve(1);
      });
    }).catch((error: Error) => {
      this.mode = 'remote';
      throw error;
    });
  };

  private initRemoteListeners() {
    this.socket.on('message', (data: Buffer) => {
      const msg = osc.unpackMessage(data);
      this.listennersRemote.forEach(({ name, event }) => {
        if (msg.address === name) {
          event(msg.args);
        };
      });
    });
    this.socket.on('error', (err) => {
      console.log(`client err: \n${err.stack}`);
    });
  };

  private async initInternalListeners() {
    return this.server.receive.subscribe((msg: string[]) => {
      this.listennersInternal.forEach(({ name, event }) => {
        if (msg[0] === name) {
          msg.shift();
          event(msg);
        };
      });
    });
  };

  async quit () {
    if (this.mode === 'internal') {
      return this.server.quit();
    };
    this.socket.close();
  };

  public subscribe(address: string, callback: SCSynthEvent): number {
    if (this.mode === 'internal') {
      return this.subscribeInternal(address, callback);
    } else if (this.mode === 'remote') {
      return this.subscribeRemote(address, callback);
    };
    return -1;
  };

  private subscribeRemote(address: string, callback: SCSynthEvent): number {
    const id = this.getEventId();
    this.listennersRemote.push({
      id: id,
      name: address,
      event: callback
    });
    return id;
  };

  private subscribeInternal(address: string, callback: SCSynthEvent): number {
    const id = this.getEventId();
    this.listennersInternal.push({
      id: id,
      name: address,
      event: callback
    });
    return id;
  };

  public unsubscribe(id: number): void {
    // console.log('UNSUBSCRIED1:', this.listennersRemote);
    this.listennersRemote = this.listennersRemote.filter(l => {
      return l.id !== id;
    });
    this.listennersInternal = this.listennersInternal.filter(l => {
      return l.id !== id;
    });
    // console.log('UNSUBSCRIED2:', this.listennersRemote);
  };

  public sendMsg(arg: any) {
    if (this.mode === 'internal') {
      this.server.send.msg(arg);
    } else if (this.mode === 'remote') {
      const address = arg[0].split('/')[1];
      arg.shift();
      let message;
      if (arg.length >= 1) {
        message = new OSC.Message([address], ...arg);        
      } else {        
        message = new OSC.Message(address, []);
      };
      const binary = message.pack();
      this.socket.send(Buffer.from(binary), 0, binary.byteLength, 57110, 'localhost');
    };
  };

  async allocReadBuffer(file: string, bufnum: number | null) {
    return new Promise<{ value: osc.OscType | undefined, error: Error | undefined }>((resolve, reject) => {
      const failId = this.subscribe('/fail', (msg) => {
        this.unsubscribe(failId);
        this.unsubscribe(doneId);
        reject({ value: undefined, id: new Error('/fail') });
      });
      const doneId = this.subscribe('/done', (msg) => {
        this.unsubscribe(failId);
        this.unsubscribe(doneId);
        if (msg && msg[0] == '/b_allocRead') {
          resolve({ value: msg[1], error: undefined });
        } else {
          reject({ value: undefined, error: new Error('failed at /done msg') });
        };
      });
      if (bufnum === null) { 
        bufnum = this.nextBufnum();
      } else {
        this.bufnum = bufnum + 1;
      }
      this.sendMsg(['/b_allocRead', bufnum, file]);
    });
  };

  async loadSynthDefFromFile(name: string, file: string) {
    return new Promise<{ id: number, error: Error | undefined }>((resolve, reject) => {
      const doneId = this.subscribe('/done', (msg) => {
        this.unsubscribe(doneId);
        if (msg && msg[0] == '/d_recv') {
          resolve({ id: doneId, error: undefined });
        } else {
          reject({ id: doneId, error: new Error('maybe /fail') });
        };
      });
      if (this.mode === 'internal') {
        this.server?.loadSynthDef(name, file).catch((e: Error) => {
          reject({ id: doneId, error: e });
        });
      } else {
        reject({ id: doneId, error: new Error('server not booted at internal.') });
      };
    });
  };

  playBuffer(bufnum: number) {    
    this.sendMsg(['/s_new', 'player', this.nextNodeId(), 1, 0, 'bufnum', bufnum]);
  };

  freeBuffer(bufnum: number) {
    this.sendMsg(['/b_free', bufnum]);
  };

  async writeBufferAsWav(bufNum: number, filePath: string) {
    this.sendMsg(['/b_write', bufNum, filePath, 'wav', 'int24']);
  };

  sliceBuffer() {
    
  };

};
