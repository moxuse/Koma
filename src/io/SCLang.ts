const sc = require('supercolliderjs');

const audioInStnthDefFilePath = __dirname + '\/../../media/audioIn.scd';
const playerStnthDefFilePath = __dirname + "./'\/../../../media/player.scd";
const recorderStnthDefFilePath = __dirname + "./'\/../../../media/recorder.scd";

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
      })
    });
  }

  async loadSynthDefs() {
    await this.lang.interpret(
      `~q = "${audioInStnthDefFilePath}".loadPaths;
      ~q[0].store;`
    );
    await this.lang.interpret(
      `~q = "${playerStnthDefFilePath}".loadPaths;
      ~[0].store;`
    );
    return await this.lang.interpret(
      `~q = "${recorderStnthDefFilePath}".loadPaths;
      ~[0].store;`
    );
  }
}