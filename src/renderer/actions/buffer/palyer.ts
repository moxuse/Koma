import { Dispatch } from 'redux';

export type PlayerRequestPayload = {
  isPlaying: boolean,
  bufnum: number,
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

export const player = (bufnum: number) => {
  return (dispatch: Dispatch<PlayerAction>) => {
    dispatch(playerRequest({
      isPlaying: true,
      bufnum: bufnum,
      error: undefined,
    }));
    window.api.on!('playerSuccess', (_) => {
      dispatch(playerSuccess({
        isPlaying: false,
        bufnum: bufnum,
        error: undefined,
      }));
      removeEvents();
    });
    window.api.on!('playerFailure', (_, arg: Error) => {
      dispatch(playerFailure({
        isPlaying: false,
        bufnum: bufnum,
        error: arg,
      }));
      removeEvents();
    });
    window.api.playerRequest(bufnum);
  };
};
