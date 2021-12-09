import { ActionCreator, Dispatch, Action } from 'redux';

export type PlayerRequestPayload = {
  isPlaying: boolean,
  bufnum: number,
  error: Error | undefined
}

export interface PlayerRequest {
  type: 'PLAYER_REQUEST',
  payload: PlayerRequestPayload
}

export interface PlayerSuccess {
  type: 'PLAYER_SUCCESS',
  payload: PlayerRequestPayload
}

export interface PlayerFailure {
  type: 'PLAYER_FAILURE',
  payload: PlayerRequestPayload
}

export type PlayerAction = PlayerRequest | PlayerSuccess | PlayerFailure;

export const playerRequest: ActionCreator<PlayerAction> = (
  payload: PlayerRequestPayload
): PlayerAction => ({
  type: 'PLAYER_REQUEST',
  payload 
});

export const playerSuccess: ActionCreator<PlayerAction> = (
  payload: PlayerRequestPayload
): PlayerAction => ({
  type: 'PLAYER_SUCCESS',
  payload 
});

export const playerFailure: ActionCreator<PlayerAction> = (
  payload: PlayerRequestPayload
): PlayerAction => ({
  type: 'PLAYER_FAILURE',
  payload 
});

const removeEvents = () => {
  window.api.removeAllListeners('playerSuccess');
  window.api.removeAllListeners('playerFailure');
}

export const player = (bufnum: number) => {
  return (dispatch: Dispatch<Action>) => {
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
  }
}