const sc = require('supercolliderjs');
import * as dgram from 'dgram';
import * as OSC from 'osc-js';
import * as osc from '@supercollider/osc';

const sampleFilePath = __dirname + '\/../../media/sample.wav';
const playerStnthDefFilePath = __dirname + "./'\/../../../media/player.scd";
const recorderStnthDefFilePath = __dirname + "./'\/../../../media/recorder.scd";

export type SCSynthMode = 'internal' | 'remote'

export type SCSynthEvent = (msg: string[] | osc.OscValues | undefined) => void;

export default class SCSynth {
  public mode: SCSynthMode;
  private socket;
  private server: any;
  private listennersRemote: Array<{ name: string, event: SCSynthEvent }>;
  private listennersInternal: Array<{ name: string, event: SCSynthEvent }>;
  private udpPort: number = 8000;

  constructor() {
    this.mode = 'remote';
    this.socket = dgram.createSocket('udp4');
    this.socket.bind(this.udpPort, 'localhost');
    this.listennersRemote = [];
    this.listennersInternal = [];
  }

  async boot() {
    this.initRemoteListeners();
    const foundRemote = await this.checkRemoteHealth();
    if (!foundRemote) {
      return this.tryBoot();
    };
  }

  private async checkRemoteHealth() {
    return new Promise(async (resolve, reject) => {
      const timeout = setTimeout(() => resolve(false), 1000);
      this.subscribeRemote('/synced', async (msg) => {
        if (msg && msg[0] === 0) {
          clearTimeout(timeout);
          resolve(true);
        }
      })
      this.sendMsg(['/sync']);
    })
  }

  private async tryBoot() {
    return new Promise(async (resolve, reject) => {
      await sc.server.boot().then(async (server: any) => {
        this.server = server;
        this.mode = 'internal';
        await this.initInternalListeners();
        resolve(0);
      })
    }).catch((error: Error) => {
      this.mode = 'remote';
      throw error;
    })
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
      console.log(`client err：\n${err.stack}`);
    });
  }

  private async initInternalListeners() {
    return this.server.receive.subscribe((msg: string[]) => {
      console.log(msg, this.listennersInternal)
      this.listennersInternal.forEach(({ name, event }) => {
        if (msg[0] === name) {
          msg.shift();
          event(msg);
        }
      });
    });
  }

  async quit () {
    if (this.mode === 'internal') {
      return this.server.quit();
    }
    this.socket.close();
  }

  public subscribeRemote(address: string, callback: SCSynthEvent) {
    this.listennersRemote.push({
      name: address,
      event: callback
    })
  }

  public subscribeInternal(address: string, callback: SCSynthEvent) {
    this.listennersInternal.push({
      name: address,
      event: callback
    })
  }

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
      }
      const binary = message.pack();
      this.socket.send(new Buffer(binary), 0, binary.byteLength, 57110, 'localhost');
    }
  }

  allocReadBuffer(bufNum: number, file: string) {
    if (this.mode === 'internal') {
      this.server.send.msg(['/b_allocRead', bufNum, file]);
    } else if (this.mode === 'remote') {
      const message = new OSC.Message(['b_allocRead'], bufNum, file);
      const binary = message.pack()
      this.socket.send(new Buffer(binary), 0, binary.byteLength, 57110, 'localhost');
    }
  }

  loadSynthDefFromFile(name: string, file: string) {
    if (this.mode === 'internal') {
      this.server?.loadSynthDef(name, file);
    }
  }

  freeBuffer() {
    
  }

  sliceBuffer() {
    
  }

  playBuffer() {
    
  }

}