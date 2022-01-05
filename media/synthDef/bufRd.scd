SynthDef("bufRd", {| bufnum, rate = 1.0, pan = 0, begin = 0, end = 1.0, gain = 0 |
	var src, mix, time, startPos, endPos;
	time = 1.0 / rate;
	src = BufRd.ar(1, bufnum, Phasor.ar(0, BufRateScale.kr(bufnum) * rate, BufFrames.kr(bufnum) * begin, BufFrames.kr(bufnum) * end), loop: 1)
    * EnvGen.ar(Env.perc(0.005, BufDur.kr(bufnum) * (end - begin), 1, 16), 1, 1, timeScale: time, doneAction:2);
	mix = ((src * 100).softclip)* 0.75;
	Out.ar(0, Pan2.ar((src * (1.0 - (gain * 0.125))) + ((gain * 0.125) * mix), pan));
});
