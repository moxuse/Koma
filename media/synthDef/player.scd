SynthDef("player", {| bufnum, rate = 1.0, pan = 0, gain = 0 |
	var src, mix, time;
	time = 1.0 / rate.abs;
	src = PlayBuf.ar(1, bufnum, BufRateScale.kr(bufnum) * rate, startPos: 0, loop:1, doneAction:2)
	 * EnvGen.ar(Env.perc(0.005, BufDur.kr(bufnum), 1, 16), 1, 1, timeScale: time, doneAction:2);
	mix = ((src * 100).softclip)* 0.75;
	Out.ar(0, Pan2.ar((src * (1.0 - (gain * 0.125))) + ((gain * 0.125) * mix), pan));
});
