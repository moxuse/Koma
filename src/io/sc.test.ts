const sc = require("supercolliderjs");
const sampleFilePath = __dirname + '\/../../media/sample.wav';

describe('boot scsynth', () => {
  it('boot at 57110', async () => {
    const server_ = await sc.server.boot();
  
    const bufNum = 4000;
    expect(server_).toBeTruthy;
    return new Promise((resolve, reject) => {
      server_.receive.subscribe((msg) => {
        if (msg[0] == '/done') {
          expect(msg[0]).toEqual('/done');
          server_.send.msg(['/b_query', bufNum]);
        } else if (msg[0] == '/b_info') {
          expect(msg[1]).toEqual(4000);
          resolve();
        } else {
          reject();
        }
      });
      server_.send.msg(['/b_allocRead', bufNum, sampleFilePath]);
    });
  });
});

