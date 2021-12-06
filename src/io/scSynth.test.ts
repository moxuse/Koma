import sc from "supercolliderjs";
import SCSynth from './SCSynth';

const playerStnthDefFilePath = __dirname + "./'\/../../../media/player.scd";
const recorderStnthDefFilePath = __dirname + "./'\/../../../media/recorder.scd";

describe('scStnth Class', () => {
  it('try boot and set internal mode', async () => {
    const scSynth = new SCSynth();
    return new Promise(async (resolve, reject) => {
      scSynth.subscribe('/fail', async (msg) => {
        
        resolve(expect(msg ? msg[0] : 'foo').toBeTruthy());
      })
      await scSynth.boot();
      scSynth.sendMsg(['/s_new', 'default', 3000, 1, 0]);
      expect(scSynth.mode).toEqual('internal');
    })

  });
});
