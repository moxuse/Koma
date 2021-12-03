const sc = require("supercolliderjs");
const sampleFilePath = __dirname + '\/../../media/sample.wav';
const bufferWriteFilePath = __dirname + '\/../../media/test.wav';

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

    const recorder = await server_.synthDef(
      "recorder",
      `{ arg out = 40;
        Out.ar(out, SoundIn.ar(0));
      }`,
    );
    const player = await server_.synthDef(
      "playerInAudio",
      `{ arg out = 40, buffer = 0;
        RecordBuf.ar(In.ar(out,1), buffer, loop: 0, doneAction: 2);
      }`,
    );
    await Promise.all([a, recorder, player]);
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
      await server_.loadSynthDef("player", __dirname + "./'\/../../../media/player.scd");
      await server_.receive.subscribe((msg) => {
        if (msg[0] == '/done') {
          expect(msg).toBeTruthy;
          if (msg[1] == '/b_write') {            
            server_.quit();
            resolve();            
          }
        }
        if (msg == null) {
          reject();
        }
      });
      setTimeout(() => {
        server_.send.msg(['/b_alloc', bufNum, 44100 * (duration / 1000), 1]);
        server_.send.msg(['/s_new', 'recorder', 2000, 1, 0]);
        server_.send.msg(['/s_new', 'player', 3000, 1, 0, 'buffer', bufNum]);
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
