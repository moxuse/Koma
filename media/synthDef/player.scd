SynthDef("player", {| bufnum, rate = 1.0, pan = 0, gain = 0 |
	var src,mix;
	src = PlayBuf.ar(1, bufnum, BufRateScale.kr(bufnum) * rate, doneAction:2);
	mix = ((src * 100).softclip)* 0.75;
	Out.ar(0, Pan2.ar((src * (1.0 - (gain * 0.125))) + ((gain * 0.125) * mix), pan));
});
