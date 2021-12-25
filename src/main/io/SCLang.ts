const sc = require('supercolliderjs');

const audioInSynthDefFilePath = __dirname + "\/../../synthDef/audioIn.scd";
const playerSynthDefFilePath = __dirname + "\/../../synthDef/player.scd";
const bufRdSynthDefFilePath = __dirname + "\/../../synthDef/bufRd.scd";
const recorderSynthDefFilePath = __dirname + "\/../../synthDef/recorder.scd";


// export type SCLangEvent = (msg: string[] | osc.OscValues | undefined) => void;

export default class SCLang {
  private lang: any;
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
};
