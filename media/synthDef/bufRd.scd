SynthDef("bufRd", {| bufnum, pan = 0, begin = 0, end = 1.0 |
	var src = BufRd.ar(1, bufnum, Phasor.ar(0, BufRateScale.kr(bufnum), BufFrames.kr(bufnum) * begin, BufFrames.kr(bufnum) * end))
    * EnvGen.ar(Env.perc(0.005, BufDur.kr(bufnum) * (end - begin), 1, 16), 1, 1, doneAction:2);
	Out.ar(0, Pan2.ar(src, pan));
});
