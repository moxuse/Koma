SynthDef("player", {| bufnum, pan = 0 |
	var src = PlayBuf.ar(1, bufnum, BufRateScale.kr(bufnum), doneAction:2);
	Out.ar(0, Pan2.ar(src, pan));
});
