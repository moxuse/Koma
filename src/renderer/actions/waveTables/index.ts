import { ActionCreator, Dispatch } from 'redux';
import { AudioData } from 'wav-decoder';
import Table from '../../model/Table';
import Sample from '../../model/Sample';
import { getNewId, ommitFileName } from '../helper';

export type LoadWaveTableRequestPayload = {
  isFetching: boolean,
  filePath: string,
  table: Table | undefined,
  sample: Sample | undefined,
  error: Error | undefined
};
/**
 * Action Creator
 */
export const loadWaveTableRequest = (
   payload: LoadWaveTableRequestPayload
 ) => ({
  type: 'LOAD_WAVE_TABLE_REQUEST',
  payload
});

export const loadWaveTableSuccess = (
  payload: LoadWaveTableRequestPayload
) => ({
  type: 'LOAD_WAVE_TABLE_SUCCESS',
  payload
});

export const loadWaveTableFailure = (
  payload: LoadWaveTableRequestPayload
) => ({
  type: 'LOAD_WAVE_TABLE_FAILURE',
  payload
});

export const deleteWaveTableRequest = (
  payload: LoadWaveTableRequestPayload
) => ({
  type: 'DELETE_WAVE_TABLE_REQUEST',
  payload
});

export const updateWaveTableByTableRequest = (
  payload: LoadWaveTableRequestPayload
) => ({
  type: 'UPDATE_WAVE_TABLE_BY_TABLE_REQUEST',
  payload
});

export const updateWaveTableBySampleRequest = (
  payload: LoadWaveTableRequestPayload
) => ({
  type: 'UPDATE_WAVE_TABLE_BY_SAMPLE_REQUEST',
  payload
});

export type LoadWaveTableAction = (
  | ReturnType<typeof loadWaveTableRequest>
  | ReturnType<typeof loadWaveTableSuccess>
  | ReturnType<typeof loadWaveTableFailure>
  | ReturnType<typeof deleteWaveTableRequest>
  | ReturnType<typeof updateWaveTableBySampleRequest>
  | ReturnType<typeof updateWaveTableByTableRequest>
);

const removeEvents = () => {
  window.api.removeAllListeners('loadWaveTableSucseed');
  window.api.removeAllListeners('loadWaveTableFailed');
};

export const loadWaveTables = (filePath: string) => (
  dispatch: Dispatch<LoadWaveTableAction>
) => {
  dispatch(loadWaveTableRequest({
    isFetching: true,
    filePath: filePath,
    table: undefined,
    sample: undefined,
    error: undefined
  }))
  window.api.on!('loadWaveTableSucseed', (_, { bufnum, filePath, data }) => {
    const sampleId = getNewId();
    const s = new Sample({ id: sampleId, allocated: true, filePath, buffer: data.omitted });
    const t = new Table({
      id: getNewId(),
      name: ommitFileName(filePath),
      bufnum: bufnum,
      sample: sampleId,
      slice: undefined
    });
    dispatch(loadWaveTableSuccess({
      isFetching: false,
      table: t,
      sample: s,
      filePath: filePath,
      error: undefined
    }));
    removeEvents()
  });
  window.api.on!('loadWaveTableFailed', (_, error) => {
    dispatch(loadWaveTableFailure({
      isFetching: false,
      filePath: filePath,
      table: undefined,
      sample: undefined,
      error: error
    }));
    removeEvents();
  });
  window.api.loadWaveTable(filePath);
};

export const deleteWaveTable = (table: Table, sample: Sample) => (
  dispatch: Dispatch<LoadWaveTableAction>
) => {
  dispatch(deleteWaveTableRequest({
    isFetching: false,
    filePath: sample.getFilePath() || '',
    table: table,
    sample: sample,
    error: undefined
  }));
};

export const updateWaveTableByTable = (table: Table) => (
  dispatch: Dispatch<LoadWaveTableAction>
) => {
  dispatch(updateWaveTableByTableRequest({
    isFetching: false,
    filePath: '',
    table: table,
    sample: undefined,
    error: undefined
  }));
};

export const updateWaveTableBySample = (sample: Sample) => (
  dispatch: Dispatch<LoadWaveTableAction>
) => {
  dispatch(updateWaveTableBySampleRequest({
    isFetching: false,
    filePath: sample.getFilePath() || '',
    table: undefined,
    sample: sample,
    error: undefined
  }));
};
