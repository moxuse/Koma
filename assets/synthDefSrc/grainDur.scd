SynthDef("grainDur", {| bufnum = 600, amp = 1, pan = 0, begin = 0, end = 1.0, gain = 0, rate = 1, trig = 4, duration = 0.1, positions = #[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], rates = #[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] |
	var src, mix, time, pos, rateT, trigger, demand;
	pos = Dseq(positions, 128);
	rateT = Demand.kr( Impulse.kr(8), 0, Dseq(rates, 127).abs);
	trigger = Impulse.kr(rateT.abs * 0.125 * (trig * 0.125));
	demand = Demand.kr(trigger, 0, pos).abs;
	src =TGrains.ar(1, trigger, bufnum,  BufRateScale.kr(bufnum) * rate,  BufDur.kr(bufnum) * ((pos+128) * 0.0078125), duration * (32.0/rateT), pan, interp: 4)
	 * EnvGen.ar(Env.asr(0.005, 1.0, 0.05), demand, 1,  levelScale: amp, doneAction: 2);
	mix = ((src * 100).softclip) * 0.75;
	Out.ar(0, Pan2.ar((src * (1.0 - (gain * 0.125))) + ((gain * 0.125) * mix), pan));
});