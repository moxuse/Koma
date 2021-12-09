import { PlayerAction } from "../actions/palyer";

const playerInitialState = {
  isPlaying: false,
  bufnum: 9000,
  error: undefined,
}

export const player = (state = playerInitialState, action: PlayerAction) => {
  switch (action.type) {
    case 'PLAYER_REQUEST':
      return {
        isPlaying: true,
        bufnum: action.payload,
        error: undefined
      }
    case 'PLAYER_SUCCESS':
      return {
        isPlaying: action.payload.isPlaying,
        bufnum: action.payload.bufnum,
        error: undefined
      }
    case 'PLAYER_FAILURE':
      return {
        isPlaying: action.payload.isPlaying,
        bufnum: action.payload.bufnum,
        error: action.payload.error
      }
    default:
      return state;
  }
}