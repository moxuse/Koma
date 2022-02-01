type MidiEventCallback = (event: WebMidi.MIDIMessageEvent) => void;

interface MidiEvent {
  id: number;
  channel: number;
  callback: MidiEventCallback;
}

export interface Midi {
  access: WebMidi.MIDIAccess | undefined;
  devices: string[];
  eventId: number;
  events: MidiEvent[];
  isReady: boolean;
}

export interface MidiActions {
  initDevices: () => void;
  updateDevice: () => void;
  subscribe: (channel: number, callback: MidiEventCallback) => number;
  unsubscribe: (id: number) => number;
}

export default class MIDIReceiver implements Midi, MidiActions {
  access: WebMidi.MIDIAccess | undefined;
  devices: string[];
  events: MidiEvent[];
  isReady: boolean;
  eventId: number;

  constructor() {
    this.eventId = 0;
    this.isReady = false;
    this.devices = [];
    this.events = [];
    this.initDevices().then(() => {
      if (this.isReady) {
        this.assignEvents();
      }
    });
  }

  async initDevices() {
    await navigator.requestMIDIAccess().then(
      (midiAccess: WebMidi.MIDIAccess) => { // succeed
        this.access = midiAccess;
        this.access.inputs.forEach((entry) => this.devices.push(entry.name || ' --- '));
        this.isReady = true;
      },
      (msg: string) => { // failed
        console.error('web midi  error:', msg);
        this.isReady = false;
      },
    );
  }

  updateDevice(): void {
    this.isReady = false;
    if (!this.access) {
      return;
    }
    this.devices = [];
    this.initDevices();
  }

  getEventId = () => {
    const next = this.eventId;
    this.eventId++;
    return next;
  };

  subscribe(channel: number, callback: MidiEventCallback): number {
    const id = this.getEventId();
    this.events.push({ id, channel, callback });
    return id;
  }

  unsubscribe(id: number): number {
    this.events = this.events.filter((e) => {
      return e.id !== id;
    });
    return id;
  }

  unscbscribeAll() {
    this.events = [];
  }

  private assignEvents() {
    this.access?.inputs.forEach((entry) => {
      entry.onmidimessage = ((e: WebMidi.MIDIMessageEvent) => {
        this.events.forEach((event) => {
          if (event.channel === (e.data[0] - 0x90)) {
            event.callback(e);
          }
        });
      });
    });
  }
}

