import exp from 'constants';
import SCLang from './SCLang';

describe('boot lang', () => {
  it('And load SynthDefs', async () => {
    const scLang = new SCLang();
    await scLang.boot();
    
    await scLang.loadSynthDefs();
    return expect(scLang).toBeTruthy();
  });
});