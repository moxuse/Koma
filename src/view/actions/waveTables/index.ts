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
}
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

export type LoadWaveTableAction = (
  | ReturnType<typeof loadWaveTableRequest>
  | ReturnType<typeof loadWaveTableSuccess>
  | ReturnType<typeof loadWaveTableFailure>
)

const removeEvents = () => {
  window.api.removeAllListeners('loadWaveTableSucseed');
  window.api.removeAllListeners('loadWaveTableFailed');
}

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
  window.api.on!('loadWaveTableSucseed', (_, arg: { bufnum: number, data: AudioData }) => {
    
    const sampleId = getNewId();
    const s = new Sample({ id: sampleId, allocated: true, filePath, buffer: arg.data.channelData[0] });
    console.log('SUNCKDJJ',s.getAllocated())
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
}
