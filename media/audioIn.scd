SynthDef("audioIn", {
	var w = SoundIn.ar(0);
	Out.ar(40, w);
});
