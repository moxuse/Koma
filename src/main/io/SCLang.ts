const sc = require('supercolliderjs');

// export type SCLangEvent = (msg: string[] | osc.OscValues | undefined) => void;

export default class SCLang {
  maxDuration: number;
  private lang: any;
  constructor() {
    this.maxDuration = 10.0;
  }
  async boot() {
    return new Promise((resolve, reject) => {
      sc.lang.boot().then((lang: any) => {
        this.lang = lang;
        resolve(lang);
      }).catch((err: Error) => {
        reject(err);
      });
    });
  }

  async quit() {
    this.lang.quit();
  }

  async startRecord(bufnum: number) {
    this.lang.interpret(`
      var buffer = Buffer.alloc(Server.local, 44100 * ${this.maxDuration}, 1, bufnum: ${bufnum});
      ~bufferTask = Task({
          var count, resamples;
          count = -1;
          loop{
            var array;
            0.5.wait;
            array = buffer.loadToFloatArray(count * 22050, 22000, {|arr|                  
              resamples = arr.select({|item, i| (i%2200) == 0 }); // 10 samples each task                  
            });
            NetAddr("localhost", 8000).sendMsg('/buf_info', resamples);
            count = count + 1;
          };
        });
        ~bufferTask.start();
      `);
  }

  async stopRecord() {
    this.lang.interpret('~bufferTask.stop();');
  }
}
