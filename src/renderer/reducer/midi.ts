import { MIDIAssignAction, MIDIAssignPayload } from '../actions/midi';

const midiInitialState: MIDIAssignPayload = {
  channel: -1,
};

export const midiAssign = (
  state = midiInitialState, action: MIDIAssignAction,
) => {
  switch (action.type) {
    case 'MIDI_ON_RECIEVE':
      return {
        channel: action.payload.channel,
      };
    default:
      return state;
  }
};
