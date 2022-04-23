import { Dispatch } from 'redux';
import Table from '../../model/Table';
import Sample from '../../model/Sample';
import { omitFileName } from '../helper';
import { loadWaveTableRequest, updateWaveTableByTable, updateWaveTableBySample, loadWaveTableFailure } from '../waveTables';

export interface RecordRequestPayload {
  isRecording: boolean;
  bufnum: number;
  writePath: string;
  error: Error | null;
}

export const startRecordRequest = (
  payload: RecordRequestPayload,
) => ({
  type: 'SATRT_RECORD_REQUEST',
  payload: payload,
});

export const stopRecordRequest = (
  payload: RecordRequestPayload,
) => ({
  type: 'STOP_RECORD_REQUEST',
  payload: payload,
});

export const stopRecordSuccess = (
  payload: RecordRequestPayload,
) => ({
  type: 'STOP_RECORD_SUCCESS',
  payload: payload,
});

export const stopRecordFailure = (
  payload: RecordRequestPayload,
) => ({
  type: 'STOP_RECORD_FAILURE',
  payload: payload,
});

export type RecordAction = (
  | ReturnType<typeof startRecordRequest>
  | ReturnType<typeof stopRecordRequest>
  | ReturnType<typeof stopRecordSuccess>
  | ReturnType<typeof stopRecordFailure>
  | ReturnType<typeof loadWaveTableRequest>
  | ReturnType<typeof updateWaveTableByTable>
  | ReturnType<typeof updateWaveTableBySample>
);

const removeStartEvents = () => {
  window.api.removeAllListeners('startRecordSuccess');
  window.api.removeAllListeners('startRecordFailure');
};

const removeStopEvents = () => {
  window.api.removeAllListeners('stopRecordSuccess');
  window.api.removeAllListeners('stopRecordFailure');
  window.api.removeAllListeners('onRecordingBuffer');
  window.api.removeAllListeners('onRecordEnd');
};

const removeWaveTableEvents = () => {
  window.api.removeAllListeners('loadWaveTableSucceed');
  window.api.removeAllListeners('loadWaveTableFailed');
};

const loadWaveTableActions = (dispatch: Dispatch<RecordAction>, table: Table, sample: Sample, filePath_: string) => {
  dispatch(loadWaveTableRequest({
    isFetching: true,
    filePath: filePath_,
    table: undefined,
    sample: undefined,
    effect: undefined,
    error: undefined,
  }));
  window.api.on!('loadWaveTableSucceed', (_, { bufnum, filePath, data }) => {
    const newSample = new Sample({ id: sample.getId(), state: 'ALLOCATED', filePath, buffer: data.omitted });
    const newTale = new Table({
      id: table.getId(),
      mode: 'normal',
      name: omitFileName(filePath),
      bufnum: bufnum,
      sample: sample.getId(),
      effect: sample.getId(),
      slice: undefined,
    });
    dispatch(updateWaveTableByTable(newTale));
    dispatch(updateWaveTableBySample(newSample));
    removeWaveTableEvents();
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
    removeWaveTableEvents();
  });
  window.api.loadWaveTable(filePath_);
};

export const startRecord = (table: Table, sample: Sample, writePath: string) => {
  let recordingBuffers: number[] = [];
  return (dispatch: Dispatch<RecordAction>) => {
    dispatch(startRecordRequest({
      isRecording: true,
      bufnum: table.getBufnum(),
      writePath: writePath,
      error: null,
    }));
    window.api.on!('startRecordSuccess', () => {
      removeStartEvents();
    });
    window.api.on!('startRecordFailure', () => {
      removeStartEvents();
      window.api.removeAllListeners('onRecordingBuffer');
    });
    window.api.startRecordRequest(table.getBufnum(), writePath);

    window.api.on!('onRecordingBuffer', (_, arg: { bufnum: number; buffers: [number] }) => {
      console.log(recordingBuffers.length, recordingBuffers.length + arg.buffers.length);
      const newBuffer = new Float32Array(recordingBuffers.length + arg.buffers.length);
      const appending = arg.buffers.map(v => v * 0.00390625);
      newBuffer.set(recordingBuffers);
      newBuffer.set(appending, recordingBuffers.length);
      recordingBuffers = recordingBuffers.concat(appending);

      const newSample = new Sample({ id: sample.getId(), state: 'ALLOCATED', filePath: sample.getFilePath(), buffer: newBuffer });
      dispatch(updateWaveTableBySample(newSample));
    });

    window.api.on!('onRecordEnd', (_, arg: { path: string }) => {
      window.api.removeAllListeners('onRecordEnd');

      removeStartEvents();
      setTimeout(() => {
        loadWaveTableActions(dispatch, table, sample, arg.path);
      }, 500);
    });
  };
};

export const stopRecord = (table: Table, sample: Sample, writePath: string) => {
  return (dispatch: Dispatch<RecordAction>) => {
    dispatch(startRecordRequest({
      isRecording: true,
      bufnum: 0,
      writePath: writePath,
      error: null,
    }));
    window.api.on!('stopRecordSuccess', () => {
      dispatch(stopRecordSuccess({
        isRecording: false,
        bufnum: 0,
        writePath: writePath,
        error: null,
      }));
      setTimeout(() => {
        loadWaveTableActions(dispatch, table, sample, writePath);
      }, 500);
      removeStopEvents();
    });
    window.api.on!('stopRecordFailure', (_, arg: Error) => {
      dispatch(stopRecordFailure({
        isRecording: false,
        bufnum: 0,
        writePath: writePath,
        error: arg,
      }));
      removeStopEvents();
    });
    window.api.stopRecordRequest(table.getBufnum(), writePath);
  };
};
