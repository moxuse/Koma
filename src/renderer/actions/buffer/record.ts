import { Dispatch } from 'redux';

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
);

const removeStartEvents = () => {
  window.api.removeAllListeners('startRecordSuccess');
  window.api.removeAllListeners('startRecorDFailure');
};

const removeStopEvents = () => {
  window.api.removeAllListeners('stopRecordSuccess');
  window.api.removeAllListeners('stopRecordFailure');
};

export const startRecord = (bufnum: number) => {
  return (dispatch: Dispatch<RecordAction>) => {
    dispatch(startRecordRequest({
      isRecording: true,
      bufnum: bufnum,
      writePath: '',
      error: null,
    }));
    window.api.on!('startRecordSuccess', () => {
      removeStartEvents();
    });
    window.api.on!('startRecorDFailure', () => {
      removeStartEvents();
    });
    window.api.startRecordRequest(bufnum);
  };
};

export const stopRecord = (writePath: string) => {
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
      removeStopEvents();
    });
    window.api.on!('stopRecordFailure', (_, arg: Error) => {
      console.error('~~~~~~~~~~~~~~~stopRecordFailure~', arg);
      dispatch(stopRecordFailure({
        isRecording: false,
        bufnum: 0,
        writePath: writePath,
        error: arg,
      }));
      removeStopEvents();
    });
    window.api.stopRecordRequest(writePath);
  };
};
