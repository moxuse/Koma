import sc from "supercolliderjs";
import SCSynth from './SCSynth';

const audioInStnthDefFilePath = __dirname + "./'\/../../../media/audioIn.scd";
const recorderStnthDefFilePath = __dirname + "./'\/../../../media/recorder.scd";
const sampleFilePath = __dirname + '\/../../media/sample.wav';

const bufNum = 9000;

describe('void test', () => {
  test('void test', () => {
    expect(true).toEqual(true);
  });
});


/*
describe('scStnth Class check internal server boot', () => {
  it('try boot and set internal mode', async () => {
    const scSynth = new SCSynth();
    return new Promise(async (resolve, reject) => {
      scSynth.subscribeInternal('/fail', async (msg) => {
        resolve(expect(msg ? msg[0] : 'foo').toBeTruthy());
      })
      await scSynth.boot();
      scSynth.sendMsg(['/s_new', 'default', 3000, 1, 0]);
      expect(scSynth.mode).toEqual('internal');
    })
  });
});


describe('scSytnth Class check remote server boot and sync', () => {
  it('try boot and set remote mode', async () => {
    const scSynth = new SCSynth();
    return new Promise(async (resolve, reject) => {
      scSynth.subscribeRemote('/synced', async (msg) => {
        resolve(expect(msg ? msg[0] : msg).toEqual(0))
      })
      await scSynth.boot();
      scSynth.sendMsg(['/sync']);
      expect(scSynth.mode).toEqual('remote');
    })
  });
});

*/

describe('scSytnth server buffer allocation', () => {
  it('on Remote', async () => {
    const scSynth = new SCSynth();
    return new Promise(async (resolve, reject) => {
      scSynth.subscribeRemote('/done', async (msg) => {
        console.log(msg);
        resolve(expect(msg ? msg[0] : msg).toEqual('/b_allocRead'));
      })
      await scSynth.boot();
      expect(scSynth.mode).toEqual('remote');
      scSynth.allocReadBuffer(bufNum, sampleFilePath);
      
    });
  });
});
