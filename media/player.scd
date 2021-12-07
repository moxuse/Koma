SynthDef("player", {| bufnum, pan = 0 |
	var src = PlayBuf.ar(1, bufnum, BufRateScale.kr(bufnum), doneAction:2);
	Out.ar(Pan2.ar(0, pan), src);
});
