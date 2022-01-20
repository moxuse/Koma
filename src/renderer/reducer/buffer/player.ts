import { PlayerRequestPayload, PlayerAction } from "../../actions/buffer/player";
import Effect from "../../model/Effect";

const playerInitialState: PlayerRequestPayload = {
  isPlaying: false,
  bufnum: 600,
  slice: undefined,
  effect: new Effect(),
  error: undefined,
};

export const player = (state = playerInitialState, action: PlayerAction) => {
  switch (action.type) {
    case 'PLAYER_REQUEST':
      return {
        isPlaying: true,
        bufnum: action.payload.bufnum,
        slice: action.payload.slice,
        effect: action.payload.effect,
        error: undefined
      };
    case 'PLAYER_SUCCESS':
      return {
        isPlaying: action.payload.isPlaying,
        bufnum: action.payload.bufnum,
        slice: action.payload.slice,
        effect: action.payload.effect,
        error: undefined
      };
    case 'PLAYER_FAILURE':
      return {
        isPlaying: action.payload.isPlaying,
        bufnum: action.payload.bufnum,
        slice: action.payload.slice,
        effect: action.payload.effect,
        error: action.payload.error
      };
    default:
      return state;
  };
};
