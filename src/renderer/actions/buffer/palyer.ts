import { Dispatch } from 'redux';
import Effect, { GrainPoint } from '../../model/Effect';
import { TableMode } from '../../model/Table';
import { GrainEditorSize } from '../../components/Tools/GrainEditor';

export type PlayerRequestPayload = {
  isPlaying: boolean,
  bufnum: number,
  slice: { begin: number, end: number } | undefined
  effect: Effect,
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

const normalizeInt8Points = (points: GrainPoint[]): GrainPoint[] => { 
  return points.map(p => { return { x: Math.floor(p.x / GrainEditorSize.width * 256) - 128, y: Math.floor(p.y / GrainEditorSize.height * 256) - 128 } });
}

export const player = (mode: TableMode, bufnum: number, slice: ({ begin: number, end: number} |  undefined), effect: Effect ) => {
  return (dispatch: Dispatch<PlayerAction>) => {
    // console.log(effect.getPoints().length)
    dispatch(playerRequest({
      isPlaying: true,
      bufnum: bufnum,
      slice: slice,
      effect: effect,
      error: undefined,
    }));
    window.api.on!('playerSuccess', (_) => {
      dispatch(playerSuccess({
        isPlaying: false,
        bufnum: bufnum,
        slice: slice,
        effect: effect,
        error: undefined,
      }));
      removeEvents();
    });
    window.api.on!('playerFailure', (_, arg: Error) => {
      dispatch(playerFailure({
        isPlaying: false,
        bufnum: bufnum,
        slice: slice,
        effect: effect,
        error: arg,
      }));
      removeEvents();
    });
    switch (mode) {
      case 'normal':
        window.api.playerRequest(bufnum, slice, {
          rate: effect.getRate(),
          pan: effect.getPan(),
          gain: effect.getGain()
        });
        break;
      case 'grain':
        window.api.grainPlayerRequest(bufnum, slice, {
          rate: effect.getRate(),
          pan: effect.getPan(),
          gain: effect.getGain(),
          points: normalizeInt8Points(effect.getPoints()),
          duration: effect.getDuration(),
          trig: effect.getTrig()
        });
        break;
      default:
        break;
    }
  };
};
