import { ActionCreator, Dispatch } from 'redux';
import { AudioData } from 'wav-decoder';
import Table from '../../model/Table';
import Sample from '../../model/Sample';
import { getNewId, ommitFileName } from '../helper';

type LoadWaveTableRequestPayload = {
  isFetching: boolean,
  filePath: string
}

export interface LoadWaveTableRequest {
  type: 'LOAD_WAVE_TABLE_REQUEST',
  payload: LoadWaveTableRequestPayload
}

type LoadWaveTableSuccessPayload = {
  isFetching: boolean,
  table: Table,
  sample: Sample
}

export interface LoadWaveTableSuccess {
  type: 'LOAD_WAVE_TABLE_SUCCESS';
  payload: LoadWaveTableSuccessPayload;
}

type LoadWaveTableErrorPayload = {
  isFetching: boolean,
  error: string
}

export interface LoadWaveTableFailure {
  type: 'LOAD_WAVE_TABLE_FAILURE',
  payload: LoadWaveTableErrorPayload
}

export type LoadWaveTableAction = LoadWaveTableRequest | LoadWaveTableSuccess | LoadWaveTableFailure;

/**
 * Action Creator
 */
export const loadWaveTableRequest: ActionCreator<LoadWaveTableAction> = (
   payload: LoadWaveTableRequestPayload
 ): LoadWaveTableAction => ({
  type: 'LOAD_WAVE_TABLE_REQUEST',
  payload
});

export const loadWaveTableSuccess: ActionCreator<LoadWaveTableAction> = (
  payload: LoadWaveTableSuccessPayload
): LoadWaveTableAction => ({
  type: 'LOAD_WAVE_TABLE_SUCCESS',
  payload
});

export const loadWaveTableFailure: ActionCreator<LoadWaveTableAction> = (
  payload: LoadWaveTableErrorPayload
): LoadWaveTableAction => ({
  type: 'LOAD_WAVE_TABLE_FAILURE',
  payload
});

const removeEvents = () => {
  window.api.removeAllListeners('loadWaveTableSucseed');
  window.api.removeAllListeners('loadWaveTableFailed');
}

export const loadWaveTables = (filePath: string) => (
  dispatch: Dispatch<LoadWaveTableAction>
) => {
  dispatch(loadWaveTableRequest({
    isFetching: true,
    filePath: filePath
  }))
  window.api.on!('loadWaveTableSucseed', (_, arg: { bufnum: number, data: AudioData }) => {
    const sampleId = getNewId();
    const s = new Sample({ id: sampleId, filePath, buffer: arg.data.channelData[0] });
    const t = new Table({
      id: getNewId(),
      name: ommitFileName(filePath),
      bufnum: arg.bufnum,
      sample: sampleId,
      slice: undefined
    });
    dispatch(loadWaveTableSuccess({
      isFetching: false,
      table: t,
      sample: s
    }));
    removeEvents()
  });
  window.api.on!('loadWaveTableFailed', (_, error) => {
    dispatch(loadWaveTableFailure({
      isFetching: false,
      error: error
    }));
    removeEvents();
  });
  window.api.loadWaveTable(filePath);
}
