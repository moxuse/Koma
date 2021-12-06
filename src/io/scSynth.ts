const  sc =  require('supercolliderjs');
import * as dgram from 'dgram';
// import * as OSC from 'osc-js';
import * as osc from '@supercollider/osc';

const sampleFilePath = __dirname + '\/../../media/sample.wav';
const playerStnthDefFilePath = __dirname + "./'\/../../../media/player.scd";
const recorderStnthDefFilePath = __dirname + "./'\/../../../media/recorder.scd";

export type SCSynthMode = 'internal' | 'remote'

export type SCSynthEvent = (msg: string[] | undefined) => void;

export default class SCSynth {
  public mode: SCSynthMode;
  private socket;
  private server: any;
  private listenners: Array<{ name: string, event: SCSynthEvent }>;
  private udpPort: number = 8000;

  constructor() {
    this.mode = 'remote';
    this.socket = dgram.createSocket('udp4');
    this.socket.bind(this.udpPort, 'localhost');
    this.listenners = [];
  }

  async boot() {
    const foundRemote = await this.checkRemoteHealth();
    if (!foundRemote) {
      return this.tryBoot();
    };
  }

  private async checkRemoteHealth() {
    return false;
  }

  private async tryBoot() {
    return new Promise(async (resolve, reject) => {
      await sc.server.boot().then(async (server: any) => {
        this.server = server;
        this.mode = 'internal';
        await this.initListeners();
        resolve(0);
      })
    }).catch((error: Error) => {
      this.mode = 'remote';
      throw error;
    })
  }

  private async initListeners() {
    return this.server.receive.subscribe((msg: string[]) => {
      this.listenners.forEach(({ name, event }) => {
        if (msg[0] === name) {
          msg.shift();
          event(msg);
        }
      })
    })
  }

  async quit () {
    if (this.mode === 'internal') {
      return this.server.quit();
    } else if (this.mode === 'remote') {
      
    }
    this.socket.close();
  }

  public subscribe(address: string, callback: SCSynthEvent) {
    this.listenners.push({
      name: address,
      event: callback
    })
  }

  public sendMsg(arg: any) {
    if (this.mode === 'internal') {
      this.server.send.msg(arg);
    }
  }

  allocReadBuffer(bufNum: number, file: string) {
    if (this.mode === 'internal') {
      this.server.send.msg(['/b_allocRead', bufNum, file]);
    } else if (this.mode === 'remote') {
      // const message = new OSC.Message(['b_allocRead'], bufNum, file);
      // const binary = message.pack()
      // this.socket.send(new Buffer(binary), 0, binary.byteLength, 57110, 'localhost');
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