import { PlayerRequestPayload, PlayerAction } from "../actions/palyer";

const playerInitialState: PlayerRequestPayload = {
  isPlaying: false,
  bufnum: 600,
  error: undefined,
}

export const player = (state = playerInitialState, action: PlayerAction) => {
  switch (action.type) {
    case 'PLAYER_REQUEST':
      return {
        isPlaying: true,
        bufnum: action.payload.bufnum,
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