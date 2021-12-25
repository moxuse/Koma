import { PlayerRequestPayload, PlayerAction } from "../../actions/buffer/palyer";

const playerInitialState: PlayerRequestPayload = {
  isPlaying: false,
  bufnum: 600,
  slice: undefined,
  error: undefined,
};

export const player = (state = playerInitialState, action: PlayerAction) => {
  switch (action.type) {
    case 'PLAYER_REQUEST':
      return {
        isPlaying: true,
        bufnum: action.payload.bufnum,
        slice: action.payload.slice,
        error: undefined
      };
    case 'PLAYER_SUCCESS':
      return {
        isPlaying: action.payload.isPlaying,
        bufnum: action.payload.bufnum,
        slice: action.payload.slice,
        error: undefined
      };
    case 'PLAYER_FAILURE':
      return {
        isPlaying: action.payload.isPlaying,
        bufnum: action.payload.bufnum,
        slice: action.payload.slice,
        error: action.payload.error
      };
    default:
      return state;
  };
};
