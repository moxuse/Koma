import { List } from 'immutable';
import Table from "../model/table";
import { LoadWaveTableAction } from "../actions/loadWaveTable";

const waveTableInitialState = {
  isFetching: false,
  table: [],
}

export const waveTable = (state = waveTableInitialState, action: LoadWaveTableAction) => {
  switch (action.type) {
    case 'LOAD_WAVE_TABLE_REQUEST':
      return {
        isFetching: state.isFetching,
        filePath: action.payload.filePath,
      }
    case 'LOAD_WAVE_TABLE_SUCCESS':
      return {
        isFetching: action.payload.isFetching,
        item: action.payload.table
      }
    case 'LOAD_WAVE_TABLE_FAILURE':
      return {
        isFetching: action.payload.isFetching,
        error: action.payload.error
      }      
    default:
      return state;
  }
}
