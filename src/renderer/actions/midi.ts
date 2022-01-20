import { ActionCreator, Dispatch } from 'redux';
import TableList from '../model/TableList';

export type MIDIAssignPayload = {
  isFetching: boolean,
  channel: number | undefined,
  error: Error | undefined
}

export interface MIDIAssignRequest {
  type: 'MIDI_ASSIGN_REQUEST',
  payload: MIDIAssignPayload
};

export interface MIDIAssignSucceed {
  type: 'MIDI_ASSIGN_SUCCEED';
  payload: MIDIAssignPayload;
};

export interface MIDIAssignFailed {
  type: 'MIDI_ASSIGN_FAILED',
  payload: MIDIAssignPayload
};

export interface MIDIOnRecieve {
  type: 'MIDI_ON_RECIEVE',
  payload: MIDIAssignPayload
};

export type MIDIAssignAction =
  MIDIAssignRequest
  | MIDIAssignSucceed
  | MIDIAssignFailed
  | MIDIOnRecieve;

/**
 * Action Creator
 */
export const midiAssignRequest: ActionCreator<MIDIAssignAction> = (
  payload: MIDIAssignPayload
): MIDIAssignAction => ({
  type: 'MIDI_ASSIGN_REQUEST',
  payload
} as const);

export const midiAssignSucceed: ActionCreator<MIDIAssignAction> = (
  payload: MIDIAssignPayload
): MIDIAssignAction => ({
  type: 'MIDI_ASSIGN_SUCCEED',
  payload: payload
} as const);

export const midiAssignFailed: ActionCreator<MIDIAssignAction> = (
  payload: MIDIAssignPayload
): MIDIAssignAction => ({
  type: 'MIDI_ASSIGN_FAILED',
  payload: payload
} as const);

export const midiOnRecieveAction: ActionCreator<MIDIAssignAction> = (
  payload: MIDIAssignPayload
): MIDIAssignAction => ({
  type: 'MIDI_ON_RECIEVE',
  payload: payload
} as const);

const removeEvents = () => {
  window.api.removeAllListeners('midiAssignSucseed');
  window.api.removeAllListeners('midiAssignFailed');
};

export const midiAssign = (arg: MIDIAsssignArg) => {
  return async (dispatch: Dispatch<MIDIAssignAction>) => {
    dispatch(midiAssignRequest({
      isFetching: true,
      channel: undefined,
      error: undefined
    }));
    window.api.on!('midiAssignSucseed', (_, arg: {}) => {
      dispatch(midiAssignSucceed({
        isFetching: false,
        channel: undefined,
        error: undefined
      }));
      removeEvents();
    });
    window.api.on!('midiAssignFailed', (_, error) => {
      dispatch(midiAssignFailed({
        isFetching: false,
        channel: undefined,
        error: error
      }));
      removeEvents();
    });
    window.api.midiAssign(arg);
  };
};

export const midiOnRecieve = (channel: number | undefined) => {
  return (dispatch: Dispatch<MIDIAssignAction>) => {
    dispatch(midiOnRecieveAction({
      isFetching: false,
      channel: channel,
      error: undefined
    }));
  };
}
