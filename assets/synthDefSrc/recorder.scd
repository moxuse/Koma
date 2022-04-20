SynthDef("recorder", { |bufnum = 9999|
    RecordBuf.ar(SoundIn.ar(0), bufnum, loop: 0, doneAction: 2);
});