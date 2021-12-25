import { Dispatch } from 'redux';
import Table from '../../model/Table';

export type PlayerRequestPayload = {
  isPlaying: boolean,
  bufnum: number,
  slice: { begin: number, end: number} |  undefined
  error: Error | undefined
};

export const playerRequest = (
  payload: PlayerRequestPayload
) => ({
  type: 'PLAYER_REQUEST',
  payload 
});

export const playerSuccess  = (
  payload: PlayerRequestPayload
) => ({
  type: 'PLAYER_SUCCESS',
  payload 
});

export const playerFailure = (
  payload: PlayerRequestPayload
) => ({
  type: 'PLAYER_FAILURE',
  payload 
});

export type PlayerAction = (
  | ReturnType<typeof playerRequest>
  | ReturnType<typeof playerSuccess>
  | ReturnType<typeof playerFailure>
);

const removeEvents = () => {
  window.api.removeAllListeners('playerSuccess');
  window.api.removeAllListeners('playerFailure');
};

export const player = (bufnum: number, slice: ({ begin: number, end: number} |  undefined) ) => {
  return (dispatch: Dispatch<PlayerAction>) => {
    dispatch(playerRequest({
      isPlaying: true,
      bufnum: bufnum,
      slice: slice,
      error: undefined,
    }));
    window.api.on!('playerSuccess', (_) => {
      dispatch(playerSuccess({
        isPlaying: false,
        bufnum: bufnum,
        slice: slice,
        error: undefined,
      }));
      removeEvents();
    });
    window.api.on!('playerFailure', (_, arg: Error) => {
      dispatch(playerFailure({
        isPlaying: false,
        bufnum: bufnum,
        slice: slice,
        error: arg,
      }));
      removeEvents();
    });
    window.api.playerRequest(bufnum, slice);
  };
};
