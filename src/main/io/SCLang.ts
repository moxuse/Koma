const sc = require('supercolliderjs');

const audioInSynthDefFilePath = __dirname + "\/../../synthDef/audioIn.scd";
const playerSynthDefFilePath = __dirname + "\/../../synthDef/player.scd";
const bufRdSynthDefFilePath = __dirname + "\/../../synthDef/bufRd.scd";
const recorderSynthDefFilePath = __dirname + "\/../../synthDef/recorder.scd";

// export type SCLangEvent = (msg: string[] | osc.OscValues | undefined) => void;

export default class SCLang {
  public lang: any;
  constructor() {}
  async boot() {
    return new Promise(async (resolve, reject) => {
      sc.lang.boot().then((lang: any) => {
        this.lang = lang;
        resolve(lang)
      }).catch((err: Error) => {
        reject(err);
      });
    });
  };

  async quit() {
    return this.lang.quit();
  };

  async loadSynthDefs() {
    await this.lang.interpret(
      `~q = "${audioInSynthDefFilePath}".loadPaths;
      ~q[0].store;`
    );
    await this.lang.interpret(
      `~q = "${playerSynthDefFilePath}".loadPaths;
      ~[0].store;`
    );
    await this.lang.interpret(
      `~q = "${bufRdSynthDefFilePath}".loadPaths;
      ~[0].store;`
    );
    return await this.lang.interpret(
      `~q = "${recorderSynthDefFilePath}".loadPaths;
      ~[0].store;`
    );
  };

  async connectMIDI() {
    return this.lang.interpret(`
      MIDIClient.init;
      MIDIClient.sources;
      MIDIIn.connect;
      s.sendMsg("/g_new", 1, 0, 0);
    `);
  }
  
  async assignMidi(channelOffset: number, data: Array<{ mode: TableMode, bufnum: number, slice: { begin: number, end: number }, pan: number, rate: number, duration: number, trig: number, gain: number,  points: Array<{ x: number, y: number}>}>) {
    let funcDef: string = '';
    data.forEach((d, i) => {
      const positions: number[] = d.points.map(p => { return p.x });
      const rates: number[] = d.points.map(p => { return p.y * -1 });
      if ('normal' === d.mode && d.slice.begin && d.slice.end) {
        funcDef += `MIDIdef.noteOn("msmplr-${i}", {arg ...args;
        var amp, rate;
        rate = ${d.rate} * (args[1] - 60).midiratio;
        amp = args[0] * 0.0078125;
        s.sendMsg("/s_new", "bufRd", s.nextNodeID, 0, 1, "bufnum", ${d.bufnum}, "rate", rate, "pan", ${d.pan}, "gain", ${d.gain}, "amp", amp, "begin", ${d.slice.begin}, "end", ${d.slice.end});
        NetAddr("localhost", 8000).sendMsg("/midi", ${i +  channelOffset});
        }, nil, ${i + channelOffset});`
      } else if ('grain' === d.mode && d.points.length >= 1) {
        funcDef += `MIDIdef.noteOn("msmplr-${i}", {arg ...args;
        var amp, rate;
        amp = args[0] * 0.0078125;
        s.sendMsg("/s_new", "grainPlayer", s.nextNodeID, 0, 1, "bufnum", ${d.bufnum}, "pan", ${d.pan}, "gain", ${d.gain}, "amp", amp, "trig", ${d.trig}, "duration", ${d.duration}, "positions", $[, ${positions}, $], "rates", $[, ${rates}, $], "dummy", 0);
        NetAddr("localhost", 8000).sendMsg("/midi", ${i +  channelOffset});
        }, nil, ${i + channelOffset});`
      } else { 
        funcDef += `MIDIdef.noteOn("msmplr-${i}", {arg ...args;
        var amp, rate;
        rate = ${d.rate} * (args[1] - 60).midiratio;
        amp = args[0] * 0.0078125;
        s.sendMsg("/s_new", "player", s.nextNodeID, 0, 1, "bufnum", ${d.bufnum}, "rate", rate, "pan", ${d.pan}, "gain", ${d.gain}, "amp", amp);
        NetAddr("localhost", 8000).sendMsg("/midi", ${i +  channelOffset});
        }, nil, ${i + channelOffset});`
      }
    });
    return this.lang.interpret(`
      MIDIdef.freeAll;
      ` + funcDef);
  };
   
};
