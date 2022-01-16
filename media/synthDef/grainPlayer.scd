SynthDef("grainPlayer", {| bufnum = 600, rate = 1.0, pan = 0, begin = 0, end = 1.0, gain = 0, trig = 4, duration = 0.1, positions = #[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] |
	var src, mix, time, pos, trigger;
	pos = Dseq(positions, inf);
	trigger = Impulse.ar(trig);
	src =TGrains.ar(1, trigger, bufnum, rate, BufDur.kr(bufnum) * ((pos+128) * 0.0078125), duration, pan, interp:4)
	 * EnvGen.ar(Env.perc(0.005, BufDur.kr(bufnum) * (end - begin), 1, 16), 1, 1, doneAction:2);
	mix = ((src * 100).softclip)* 0.75;
	Out.ar(0, Pan2.ar((src * (1.0 - (gain * 0.125))) + ((gain * 0.125) * mix), pan));
});