const sc = require('supercolliderjs');
const sampleFilePath = __dirname + '\/../../../media/sound/sample.wav';
const bufferWriteFilePath = __dirname + '\/../../../media/sound/test.wav';

const dgram = require('dgram');
const OSC = require('osc-js');
const osc = require('@supercollider/osc');


describe('boot sc', () => {
  it('boot compile & execute', async () => {
    const server_ = await sc.server.boot();
    const lang_ = await sc.lang.boot();
    expect(server_).toBeTruthy();
    expect(lang_.isReady()).toEqual(true);
    return lang_;
  });
});

/*
describe('boot scsynth', () => {
  it('boot and allocate/read Buffer, recieve done msg', async () => {
    const server_ = await sc.server.boot();
    const bufNum = 4000;
    expect(server_).toBeTruthy;
    
    return new Promise((resolve, reject) => {
      server_.receive.subscribe(async (msg) => {
        if (msg[0] == '/done') {
          expect(msg[0]).toEqual('/done');
          server_.send.msg(['/b_query', bufNum]);
        } else if (msg[0] == '/b_info') {
          expect(msg[1]).toEqual(4000);
          server_.send.msg(['/b_free', bufNum]);
          await server_.quit();
          resolve();
        } else {
          reject();
        };
      });
      server_.send.msg(['/b_allocRead', bufNum, sampleFilePath]);
    });
  });
});

describe('boot scLang', () => {
  it('boot compile & execute', async () => {
    const lang_ = await sc.lang.boot();
    const res = await lang_.interpret(`
    fork{
      var t = Task({
        var count = 0;
        loop{
          0.075.wait;
          count.postln;
          count = count + 1;
        };
      });
      t.play;
      0.25.wait;
      t.stop;
      }
    `);
    expect(res.string).toEqual('a Routine');
    await lang_.quit();
    console.log('quit lang!')
    return expect(lang_.isReady()).toEqual(false);
  });
});

describe('declar synthdef', () => {
  it('declar and send', async () => {
    let server_;
    const a = await sc.server.boot().then((server) => {
      server_ = server;
    })
    expect(server_.isRunning).toEqual(true);

    const audioIn = await server_.synthDef(
      "audioIn",
      `{ arg out = 40;
        Out.ar(out, SoundIn.ar(0));
      }`,
    );
    const recorder = await server_.synthDef(
      "recorder",
      `{ arg out = 40, buffer = 0;
        RecordBuf.ar(In.ar(out,1), buffer, loop: 0, doneAction: 2);
      }`,
    );
    await Promise.all([a, audioIn, recorder]);
    return server_.quit();
  });
  
});

describe('buffer write at scsynth', () => {
  it('record Buffer and write Wav file', async () => {
    const bufNum = 4000;
    const duration = 3000; // ms    
    let server_;
    try {
      const a = await sc.server.boot().then((server) => {
        server_ = server;
      })
      
      expect(server_).toBeTruthy;
      await server_.loadSynthDef("recorder", __dirname + "./'\/../../../media/recorder.scd");
      await server_.loadSynthDef("audioIn", __dirname + "./'\/../../../media/audioIn.scd");
      await server_.receive.subscribe((msg) => {
        if (msg[0] == '/done') {
          expect(msg).toBeTruthy;
          if (msg[1] == '/b_write') {            
            server_.quit();      
          }
        }
      });
      setTimeout(() => {
        server_.send.msg(['/b_alloc', bufNum, 44100 * (duration / 1000), 1]);
        server_.send.msg(['/s_new', 'audioIn', 2000, 1, 0]);
        server_.send.msg(['/s_new', 'recorder', 3000, 1, 0, 'buffer', bufNum]);
        setTimeout(() => {
          server_.send.msg(['/n_free', 3000]);
          server_.send.msg(['/n_free', 2000]);
          server_.send.msg(['/b_write', bufNum, bufferWriteFilePath, 'wav', 'int24']);
          server_.send.msg(['/b_free', bufNum]);
        }, duration);
      }, 500);
    } catch (e) {
      expect(e).toMatch('error');
    }
  });
});

describe('communicate between remote scsynth with osc', () => {
  it('osc test', async () => {
    return new Promise((resolve, reject) => {
      const socket = dgram.createSocket('udp4');

      socket.on('message', data => {
        const r = osc.unpackMessage(data);
        console.log(r);
        socket.close();
        resolve();
      });

      socket.on('error', (err) => {
        console.log(`client err：\n${err.stack}`)
        socket.close()
        reject();
      });
      // send a messsage via udp
      const message = new OSC.Message(['query'], 0);
      const binary = message.pack()
      socket.send(new Buffer(binary), 0, binary.byteLength, 57110, 'localhost');

      setTimeout(() => {
        socket.close()
        resolve();
      }, 1000);
    });
  });
});


describe('recive task message from lang', () => {
  it('osc test', async () => {
    const bufNum = 4000;
    const duration = 3000;
    let server_;
    let lang_;
    const socket = dgram.createSocket('udp4');
    try {
      socket.on('message', data => {
        const r = osc.unpackMessage(data);
        console.log(r);
      });
    
      socket.bind(8000, 'localhost');
      
      const l = await sc.lang.boot().then((lang) => {
        lang_ = lang;
      });
      const a = await sc.server.boot().then((server) => {
        server_ = server;
      });
      await server_.loadSynthDef("recorder", __dirname + "./'\/../../../media/recorder.scd");
      await server_.loadSynthDef("player", __dirname + "./'\/../../../media/player.scd");
      await server_.receive.subscribe((msg) => {
        if (msg[0] == '/done') {
          expect(msg).toBeTruthy;
          if (msg[1] == '/b_write') {
            server_.quit();
          }
        }
      });
      await lang_.interpret(`
          var buffer = Buffer.alloc(Server.local, 44100 * ${duration / 1000}, 1, bufnum: ${bufNum});
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

      setTimeout(() => {
        server_.send.msg(['/b_alloc', bufNum, 44100 * (duration / 1000), 1]);
        server_.send.msg(['/s_new', 'audioIn', 2000, 1, 0]);
        server_.send.msg(['/s_new', 'recorder', 3000, 1, 0, 'bufNum', bufNum]);

        setTimeout(async () => {
          server_.send.msg(['/n_free', 3000]);
          server_.send.msg(['/n_free', 2000]);
          server_.send.msg(['/b_write', bufNum, bufferWriteFilePath, 'wav', 'int24']);
          server_.send.msg(['/b_free', bufNum]);

          lang_.interpret(`~bufferTask.stop();`);
          lang_.quit();
          socket.close();
          server_.quit();
        }, duration);
      }, 10);
    } catch (e) {
      expect(e).toMatch('error');
    }
  });
});
*/
