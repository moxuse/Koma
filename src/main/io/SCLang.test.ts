import SCLang from './SCLang';

let scLang: SCLang;

describe('boot lang', () => {
  it('And load SynthDefs', async () => {
    scLang = new SCLang();
    await scLang.boot();
    console.log(scLang)
    const nextNodeID = await scLang.lang.interpret(`s.nextNodeID;`);
    console.log(nextNodeID);
    // await scLang.loadSynthDefs();
    return expect(scLang).toBeTruthy();
  });
});

/*
describe('interpret', () => { 
  it('array Msg data', async () => {
    const rates = [0, 2, 5];
    const interpret = await scLang.lang.interpret(
      `s.sendMsg("rates", $[, ${rates}, $], "foo", 0);`
    );
    console.log(interpret);
    return expect(interpret).toBeTruthy();
  })
})


describe('compose MIDI pack', () => {
  it('noteOn funcDef', async () => {
    const expectFuncDef = `MIDIdef.noteOn("msmplr-0", {arg ...args;
      s.sendMsg("/s_new", "player", s.nextNodeID, 0, 1, "bufnum", 600, "rate", 1.3, "pan", -0.1, "gain", 0.5);
      }, nil, 0);MIDIdef.noteOn("msmplr-1", {arg ...args;
      s.sendMsg("/s_new", "player", s.nextNodeID, 0, 1, "bufnum", 601, "rate", 0.2, "pan", 0.1, "gain", 1);
      }, nil, 1);`;
    const data = [{
      bufnum: 600,
      rate: 1.3,
      pan: -0.1,
      gain: 0.5
    }, {
      bufnum: 601,
      rate: 0.2,
      pan: 0.1,
      gain: 1
      }];
    let funcDef = '';  
    data.forEach((d,i) => {
      funcDef += `MIDIdef.noteOn("msmplr-${i}", {arg ...args;
      s.sendMsg("/s_new", "player", s.nextNodeID, 0, 1, "bufnum", ${d.bufnum}, "rate", ${d.rate}, "pan", ${d.pan}, "gain", ${d.gain});
      }, nil, ${i});`
    });
    console.log(funcDef);
    expect(funcDef).toEqual(expectFuncDef);
  });
})

describe('MIDI IO', () => {
  it('detect midi sources name at head', async () => {
    await scLang.lang.interpret(`MIDIClient.init;`);
    const sources = await scLang.lang.interpret(`MIDIClient.sources;`);
    await scLang.lang.interpret(`MIDIIn.connect;`);
    console.log(sources);
    return expect(sources.length).toBeGreaterThanOrEqual(0);
  });

  it('set income function', async () => {
    const sources = await scLang.lang.interpret(`MIDIdef.noteOn("msmplr", {arg ...args; args.postln});`);
    return expect('foo'.length).toBeGreaterThanOrEqual(0);
  });
});
*/
