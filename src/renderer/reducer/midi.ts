import { MIDIAssignAction, MIDIAssignPayload } from "../actions/midi";

const midiInitialState: MIDIAssignPayload = {
  isFetching: false,
  channel: undefined,
  error: undefined,
};

export const midiAssign = (
  state = midiInitialState, action: MIDIAssignAction
) => {
  switch (action.type) {
    case 'MIDI_ASSIGN_REQUEST':
      return {
        isFetching: action.payload.isFetching,
        channel: action.payload.channel,
        error: state.error
      };
    case 'MIDI_ASSIGN_SUCCEED':
      return {
        isFetching: action.payload.isFetching,
        channel: action.payload.channel,
        error: action.payload.error
      };
    case 'MIDI_ASSIGN_FAILED':
      return {
        isFetching: action.payload.isFetching,
        channel: action.payload.channel,
        error: action.payload.error
      };
    case 'MIDI_ON_RECIEVE':
      return {
        isFetching: action.payload.isFetching,
        channel: action.payload.channel,
        error: action.payload.error
      };
    default:
      return state;
  };
};
