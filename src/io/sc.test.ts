const sc = require("supercolliderjs");
const sampleFilePath = __dirname + '\/../../media/sample.wav';

describe('boot scsynth', () => {
  it('boot and allocate Buffer, recieve done msg', async () => {
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
    return expect(lang_.isReady()).toEqual(false);
  });
});

describe('declar synthdef', () => {
  it('declar and send', async () => {
    let server_ = undefined;
    await sc.server.boot((server) => {
      server_ = server;
    })
    if (server_) {
      expect(server_.isReady()).toEqual(true);
      const recorder = await server_.synthDef(
        "recordr",
        `{ |freq, duration|
        var w = AudioIn.ar(1);
        Out.ar(40,w);
      }`,
      );
      const player = await server_.synthDef(
        "player",
        `{ |buffer|
          RecordBuf.ar(In.ar(40,1), buffer, loop: 0, doneAction: 2);
        }`
      );
      await server_.quit();
      expect(server_.isReady()).toEqual(false);
      return Promise.all([recorder, player]);
    };
  });
});

