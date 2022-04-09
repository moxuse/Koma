import { ActionCreator, Dispatch } from 'redux';

export interface MIDIAssignPayload {
  channel: number;
}

export interface MIDIOnReceive {
  type: 'MIDI_ON_RECEIVE';
  payload: MIDIAssignPayload;
}

export type MIDIAssignAction = MIDIOnReceive;

/**
 * Action Creator
 */

export const midiOnReceiveAction: ActionCreator<MIDIAssignAction> = (
  payload: MIDIAssignPayload,
): MIDIAssignAction => ({
  type: 'MIDI_ON_RECEIVE',
  payload: payload,
} as const);


export const midiOnReceive = (channel: number | undefined) => {
  return (dispatch: Dispatch<MIDIAssignAction>) => {
    dispatch(midiOnReceiveAction({ channel: channel }));
  };
};
