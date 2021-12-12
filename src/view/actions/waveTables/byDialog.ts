import { ActionCreator, Dispatch, Action } from 'redux';
import Table from '../../model/Table';
import Sample from '../../model/Sample';
import { getNewId, ommitFileName } from '../helper';

export type ItemPayload = {
  isFetching: true;
  table: Table | undefined;
  sample: Sample | undefined;
  error: Error | undefined;
};

export interface LoadWaveTableByDialogRequest extends Action {
  type: 'LOAD_WAVE_TABLE_BY_DIALOG_REQUEST',
  payload: ItemPayload
}

export interface LoadWaveTableByDialogSuccess extends Action {
  type: 'LOAD_WAVE_TABLE_BY_DIALOG_SUCCESS',
  payload: ItemPayload
}

export interface LoadWaveTableByDialogFailure extends Action {
  type: 'LOAD_WAVE_TABLE_BY_DIALOG_FAILURE',
  payload: ItemPayload
}

export type LoadWaveTableByDialogAction = LoadWaveTableByDialogRequest | LoadWaveTableByDialogSuccess | LoadWaveTableByDialogFailure;

/**
 * Action Creator
 */
export const loadWaveTableByDialogRequest: ActionCreator<LoadWaveTableByDialogAction> = (
  payload: ItemPayload
): LoadWaveTableByDialogAction => ({
  type: 'LOAD_WAVE_TABLE_BY_DIALOG_REQUEST',
  payload
});

export const loadWaveTableByDialogSuccess: ActionCreator<LoadWaveTableByDialogAction> = (
  payload: ItemPayload
): LoadWaveTableByDialogAction => ({
  type: 'LOAD_WAVE_TABLE_BY_DIALOG_SUCCESS',
  payload 
});

export const loadWaveTableByDialogFailure: ActionCreator<LoadWaveTableByDialogAction> = (
  payload: ItemPayload
): LoadWaveTableByDialogAction => ({
  type: 'LOAD_WAVE_TABLE_BY_DIALOG_FAILURE',
  payload 
});

const removeEvents = () => {
  window.api.removeAllListeners('loadWaveTableByDialogSucseed');
  window.api.removeAllListeners('loadWaveTableByDialogFailed');
}

export const loadWaveTableByDialog = () => {
  return (dispatch: Dispatch<Action>) => {
    dispatch(loadWaveTableByDialogRequest({
      isFetching: true,
        table: undefined,
        sample: undefined,
        error: undefined
    }))
    window.api.on!('loadWaveTableByDialogSucseed', (_, { filePath, audioData }) => {
    const sampleId = getNewId();
    const s = new Sample({ id: sampleId, filePath, buffer: audioData.channelData[0] });
      const t = new Table({
        id: getNewId(),
        name: ommitFileName(filePath),
        bufnum: 600,
        sample: sampleId,
        slice: undefined
      });
      dispatch(loadWaveTableByDialogSuccess({
        isFetching: false,
        table: t,
        sample: s,
        error: undefined
      }));
      removeEvents();
    });
    window.api.on!('loadWaveTableByDialogFailed', (_, arg: Error) => {
      dispatch(loadWaveTableByDialogFailure(
        {
          isFetching: false,
          table: undefined,
          sample: undefined,
          error: arg
        }
      ));
      removeEvents();
    });
    window.api.loadWaveTableByDialog();
  }
}
