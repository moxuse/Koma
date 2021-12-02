const sc = require("supercolliderjs");
const sampleFilePath = __dirname + '\/media/sample.wav';

// describe('boot scsynth', () => {
const init = async () => {
  console.log(sampleFilePath);
    
  const server_  = await sc.server.boot(async (server) => {
    console.info("booted server...")
  });

  const bufNum = 4000;
  server_.receive.subscribe(function(msg) {
    console.log(msg);
    if (msg[0] == '/done') {
      server_.send.msg(['/b_query', bufNum]);
    }
    if (msg[0] == '/b_info') {
      if (msg[1] == 4000 && msg[2] == 22000) {
        console.log('buffer allocated..');
      }
    }
  });
  server_.send.msg(['/b_allocRead', bufNum, sampleFilePath]);
};

init();