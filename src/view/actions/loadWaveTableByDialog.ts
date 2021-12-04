import { ActionCreator, Dispatch, Action } from 'redux';
import Table from '../model/Table';
import Sample from '../model/Sample';
import { getNewId, ommitFileName } from './helper';

export type ItemPayload = {
  isFetching: true;
  table: Table;
  sample: Sample;
};

export interface ReadTableRequest extends Action {
  type: 'READ_TABLE_REQUEST',
  payload: ItemPayload
}

export interface ReadTableSuccess extends Action {
  type: 'READ_TABLE_SUCCESS',
  payload: ItemPayload
}

export type ErrorPayload = {
  isFetching: true;
  error: string;
};

export interface ReadTableFailure extends Action {
  type: 'READ_TABLE_FAILURE',
  payload: ErrorPayload
}

export type ReadTableAction = ReadTableRequest | ReadTableSuccess | ReadTableFailure;

/**
 * Action Creator
 */
export const readTableRequest: ActionCreator<ReadTableAction> = (
  payload: ItemPayload
): ReadTableAction => ({
  type: 'READ_TABLE_REQUEST',
  payload
} as ReadTableAction);

export const readTableSuccess: ActionCreator<ReadTableAction> = (
  payload: ItemPayload
): ReadTableAction => ({
  type: 'READ_TABLE_SUCCESS',
  payload 
} as ReadTableAction);

export const readTableFailure: ActionCreator<ReadTableAction> = (
  payload: ErrorPayload
): ReadTableAction => ({
  type: 'READ_TABLE_FAILURE',
  payload 
} as ReadTableAction);

const removeEvents = () => {
  window.api.removeAllListeners('loadWaveTableByDialogSucseed');
  window.api.removeAllListeners('loadWaveTableByDialogFailed');
}

export const loadWaveTableByDialog = () => {
  return (dispatch: Dispatch<Action>) => {
    dispatch(readTableRequest())
    window.api.on!('loadWaveTableByDialogSucseed', (_, { filePath, audioData }) => {
    const sampleId = getNewId();
    const s = new Sample({ id: sampleId, filePath, buffer: audioData.channelData[0] });
      const t = new Table({
        id: getNewId(),
        name: ommitFileName(filePath),
        bufnum: 9000,
        sample: sampleId,
        slice: undefined
      });
      dispatch(readTableSuccess({
        isFetching: false,
        table: t,
        sample: s
      }));
      removeEvents();
    });
    window.api.on!('loadWaveTableByDialogFailed', (_, arg: Error) => {
      dispatch(readTableFailure(arg));
      removeEvents();
    });
    window.api.loadWaveTableByDialog();
  }}
