SynthDef("player", { |buffer|
    RecordBuf.ar(In.ar(40, 1), buffer, loop: 0, doneAction: 2);
});