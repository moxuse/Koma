import { AllocReadBufferRequestPayload, AllocReadBufferAction } from "../../actions/buffer";

const allocReadBufferInitPayload: AllocReadBufferRequestPayload = {
  filePath: undefined,
  bufnum: undefined,
  error: undefined,
}

export const allocReadBuffer = (
  state = allocReadBufferInitPayload,
  action: AllocReadBufferAction
) => {
  switch (action.type) {
    case 'ALLOC_READ_BUFFER_REQUEST':
      return {
        filePath: action.payload.filePath,
        bufnum: action.payload.bufnum,
        error: state.error
      }
    case 'ALLOC_READ_BUFFER_SUCCEED':
      return {
        filePath: action.payload.filePath,
        bufnum: action.payload.bufnum,
        error: state.error
      }
    case 'ALLOC_READ_BUFFER_FAILED':
      return {
        filePath: state.filePath,
        bufnum: state.bufnum,
        error: action.payload.error
      }
    default:
      return state;
  }
}
