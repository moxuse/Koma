// const sc = require('supercolliderjs');

// export type SCLangEvent = (msg: string[] | osc.OscValues | undefined) => void;
const maxDuration = 11.0;

export default class SCLang {
  private lang: any;
  constructor(sc: any) {
    this.lang = sc.lang;
  }
  boot() {
    return new Promise((resolve, reject) => {
      this.lang.boot({ debug: true }).then((lang_: any) => {
        this.lang = lang_;
        resolve(lang_);
      }).catch((err: Error) => {
        reject(err);
      });
    });
  }

  async quit() {
    this.lang.quit();
  }


  startRecord(bufnum: number) {
    return this.lang.interpret(
      `var buffer = Buffer.alloc(s, 44100 * ${maxDuration}, 1, bufnum: ${bufnum});
      ~x = Task({
        var count, resamples;
        count = 0;
        loop{
          var array, selected;
          0.5.wait;
          array = buffer.loadToFloatArray(count * 22050, 22000, {|arr|
            selected = arr.select({|item, i| (i%2200) == 0 }); // 10 samples each task
          });
          resamples = selected.collect({|item, i| (item * 256).asInteger });
          NetAddr("localhost", 8000).sendMsg('/buf_info', resamples);
          count = count + 1;
        };
      }).play();`,
    );
  }

  stopRecord() {
    this.lang.interpret('~x.stop();');
  }
}
