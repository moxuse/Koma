import { Dispatch } from 'redux';

export type AllocReadBufferRequestPayload = {
  filePath: string | undefined,
  bufnum: number | undefined,
  error: Error | undefined
}

export const allocReadBufferRequest = (
  payload: AllocReadBufferRequestPayload
) => ({
  type: 'ALLOC_READ_BUFFER_REQUEST',
  payload 
});

export const allocReadBufferSucceed  = (
  payload: AllocReadBufferRequestPayload
) => ({
  type: 'ALLOC_READ_BUFFER_SUCCEED',
  payload 
});

export const allocReadBufferFailed = (
  payload: AllocReadBufferRequestPayload
) => ({
  type: 'ALLOC_READ_BUFFER_FAILED',
  payload 
});

export type AllocReadBufferAction = (
  | ReturnType<typeof allocReadBufferRequest>
  | ReturnType<typeof allocReadBufferSucceed>
  | ReturnType<typeof allocReadBufferFailed>
)

const removeEvents = () => {
  window.api.removeAllListeners('playerSuccess');
  window.api.removeAllListeners('playerFailure');
}

export const allocReadBuffer = (bufnum: number, filePath: string) => {
  return (dispatch: Dispatch<AllocReadBufferAction>) => {
    dispatch(allocReadBufferRequest({
      filePath: filePath,
      bufnum: bufnum,
      error: undefined,
    }));
    window.api.on!('allocBufferSucseed', (_, ard: { bufnum: number,filePath: string }) => {
      dispatch(allocReadBufferSucceed({
        filePath: filePath,
        bufnum: bufnum,
        error: undefined,
      }));
      removeEvents();
    });
    window.api.on!('allocBufferFailed', (_, arg: Error) => {
      dispatch(allocReadBufferFailed({
        filePath: undefined,
        bufnum: undefined,
        error: arg,
      }));
      removeEvents();
    });
    window.api.allocBufferRequest(bufnum, filePath);
  }
}