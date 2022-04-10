import { Dispatch } from 'redux';
import Sample from '../../model/Sample';
import { updateWaveTableBySample } from '../waveTables';

export interface AllocReadBufferRequestPayload {
  filePath: string | undefined;
  bufnum: number | undefined;
  error: Error | undefined;
}

export const allocReadBufferRequest = (
  payload: AllocReadBufferRequestPayload,
) => ({
  type: 'ALLOC_READ_BUFFER_REQUEST',
  payload: payload,
});

export const allocReadBufferSucceed = (
  payload: AllocReadBufferRequestPayload,
) => ({
  type: 'ALLOC_READ_BUFFER_SUCCEED',
  payload: payload,
});

export const allocReadBufferFailed = (
  payload: AllocReadBufferRequestPayload,
) => ({
  type: 'ALLOC_READ_BUFFER_FAILED',
  payload: payload,
});

export type AllocReadBufferAction = (
  | ReturnType<typeof allocReadBufferRequest>
  | ReturnType<typeof allocReadBufferSucceed>
  | ReturnType<typeof allocReadBufferFailed>
);

const removeEvents = () => {
  window.api.removeAllListeners('allocBufferSucceed');
  window.api.removeAllListeners('allocBufferFailed');
};

export const allocReadBuffer = (bufnum: number, sample: Sample) => {
  return (dispatch: Dispatch<AllocReadBufferAction | any>) => {
    dispatch(allocReadBufferRequest({
      filePath: sample.getFilePath(),
      bufnum: bufnum,
      error: undefined,
    }));
    window.api.on!('allocBufferSucceed', (_, arg: { bufnum: number; filePath: string }) => {
      dispatch(allocReadBufferSucceed({
        filePath: arg.filePath,
        bufnum: arg.bufnum,
        error: undefined,
      }));
      removeEvents();
      const newSample = new Sample(sample).set('state', 'ALLOCATED');
      dispatch(updateWaveTableBySample(newSample));
    });
    window.api.on!('allocBufferFailed', (_, arg: Error) => {
      dispatch(allocReadBufferFailed({
        filePath: undefined,
        bufnum: undefined,
        error: arg,
      }));
      removeEvents();
    });
    window.api.allocBufferRequest(bufnum, sample.getFilePath()!);
  };
};
