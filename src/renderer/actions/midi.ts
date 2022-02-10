import { ActionCreator, Dispatch } from 'redux';

export interface MIDIAssignPayload {
  channel: number;
}

export interface MIDIOnRecieve {
  type: 'MIDI_ON_RECIEVE';
  payload: MIDIAssignPayload;
}

export type MIDIAssignAction = MIDIOnRecieve;

/**
 * Action Creator
 */

export const midiOnRecieveAction: ActionCreator<MIDIAssignAction> = (
  payload: MIDIAssignPayload,
): MIDIAssignAction => ({
  type: 'MIDI_ON_RECIEVE',
  payload: payload,
} as const);


export const midiOnRecieve = (channel: number | undefined) => {
  return (dispatch: Dispatch<MIDIAssignAction>) => {
    dispatch(midiOnRecieveAction({ channel: channel }));
  };
};
