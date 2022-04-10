import { RecordRequestPayload, RecordAction } from '../../actions/buffer/record';

const recordInitialState: RecordRequestPayload = {
  isRecording: false,
  bufnum: 5600,
  writePath: '',
  error: null,
};

export const record = (state = recordInitialState, action: RecordAction) => {
  switch (action.type) {
    case 'START_RECORD_REQUEST':
      return {
        isPlaying: true,
        bufnum: action.payload.bufnum,
        writePath: '',
        error: null,
      };
    case 'STOP_RECORD_REQUEST':
      return {
        isPlaying: true,
        bufnum: state.bufnum,
        writePath: action.payload.writePath,
        error: null,
      };
    case 'STOP_RECORD_SUCCESS':
      return {
        isPlaying: false,
        bufnum: state.bufnum,
        writePath: action.payload.writePath,
        error: null,
      };
    case 'STOP_RECORD_FAILED':
      return {
        isPlaying: false,
        bufnum: state.bufnum,
        writePath: state.writePath,
        error: action.payload.error,
      };
    default:
      return state;
  }
};
