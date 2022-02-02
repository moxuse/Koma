SynthDef("recorder", { |bufNum|
    RecordBuf.ar(In.ar(40, 1), bufNum, loop: 0, doneAction: 2);
});