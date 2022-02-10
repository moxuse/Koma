import { Dispatch } from 'redux';
import Table from '../../model/Table';
import Sample from '../../model/Sample';
import Effect from '../../model/Effect';
import { getNewId, ommitFileName } from '../helper';

export interface LoadWaveTableRequestPayload {
  isFetching: boolean;
  filePath: string;
  table: Table | undefined;
  sample: Sample | undefined;
  effect: Effect | undefined;
  error: Error | undefined;
}
/**
 * Action Creator
 */
export const loadWaveTableRequest = (
  payload: LoadWaveTableRequestPayload,
) => ({
  type: 'LOAD_WAVE_TABLE_REQUEST',
  payload: payload,
});

export const loadWaveTableSuccess = (
  payload: LoadWaveTableRequestPayload,
) => ({
  type: 'LOAD_WAVE_TABLE_SUCCESS',
  payload: payload,
});

export const loadWaveTableFailure = (
  payload: LoadWaveTableRequestPayload,
) => ({
  type: 'LOAD_WAVE_TABLE_FAILURE',
  payload: payload,
});

export const deleteWaveTableRequest = (
  payload: LoadWaveTableRequestPayload,
) => ({
  type: 'DELETE_WAVE_TABLE_REQUEST',
  payload: payload,
});

export const updateWaveTableByTableRequest = (
  payload: LoadWaveTableRequestPayload,
) => ({
  type: 'UPDATE_WAVE_TABLE_BY_TABLE_REQUEST',
  payload: payload,
});

export const updateWaveTableBySampleRequest = (
  payload: LoadWaveTableRequestPayload,
) => ({
  type: 'UPDATE_WAVE_TABLE_BY_SAMPLE_REQUEST',
  payload: payload,
});

export const updateWaveTableByEffectRequest = (
  payload: LoadWaveTableRequestPayload,
) => ({
  type: 'UPDATE_WAVE_TABLE_BY_EFFECT_REQUEST',
  payload: payload,
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

export const loadWaveTables = (filePath_: string) => (
  dispatch: Dispatch<LoadWaveTableAction>,
) => {
  dispatch(loadWaveTableRequest({
    isFetching: true,
    filePath: filePath_,
    table: undefined,
    sample: undefined,
    effect: undefined,
    error: undefined,
  }));
  window.api.on!('loadWaveTableSucseed', (_, { bufnum, filePath, data }) => {
    const sampleId = getNewId();
    const s = new Sample({ id: sampleId, allocated: true, filePath, buffer: data.omitted });
    const t = new Table({
      id: getNewId(),
      mode: 'normal',
      name: ommitFileName(filePath),
      bufnum: bufnum,
      sample: sampleId,
      effect: sampleId,
      slice: undefined,
    });
    let e = new Effect();
    e = e.set('id', sampleId);
    dispatch(loadWaveTableSuccess({
      isFetching: false,
      table: t,
      sample: s,
      effect: e,
      filePath,
      error: undefined,
    }));
    removeEvents();
  });
  window.api.on!('loadWaveTableFailed', (_, error) => {
    dispatch(loadWaveTableFailure({
      isFetching: false,
      filePath: filePath_,
      table: undefined,
      sample: undefined,
      effect: undefined,
      error,
    }));
    removeEvents();
  });
  window.api.loadWaveTable(filePath_);
};

export const deleteWaveTable = (table: Table, sample: Sample, effect: Effect) => (
  dispatch: Dispatch<LoadWaveTableAction>,
) => {
  dispatch(deleteWaveTableRequest({
    isFetching: false,
    filePath: sample.getFilePath() || '',
    table: table,
    sample: sample,
    effect: effect,
    error: undefined,
  }));
};

export const updateWaveTableByTable = (table: Table) => (
  dispatch: Dispatch<LoadWaveTableAction>,
) => {
  dispatch(updateWaveTableByTableRequest({
    isFetching: false,
    filePath: '',
    table: table,
    sample: undefined,
    effect: undefined,
    error: undefined,
  }));
};

export const updateWaveTableBySample = (sample: Sample) => (
  dispatch: Dispatch<LoadWaveTableAction>,
) => {
  dispatch(updateWaveTableBySampleRequest({
    isFetching: false,
    filePath: sample.getFilePath() || '',
    table: undefined,
    sample: sample,
    effect: undefined,
    error: undefined,
  }));
};

export const updateWaveTableByEffect = (table: Table, effect: Effect) => (
  dispatch: Dispatch<LoadWaveTableAction>,
) => {
  dispatch(updateWaveTableByEffectRequest({
    isFetching: false,
    filePath: '',
    table: table,
    sample: undefined,
    effect: effect,
    error: undefined,
  }));
};
