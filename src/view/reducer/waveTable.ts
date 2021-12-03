import { List } from 'immutable';
import Table from "../model/Table";
import TableList from "../model/TableList";
import { LoadWaveTableAction } from "../actions/loadWaveTable";
import { LoadStoreSuccessPayload } from "../actions/loadStore";


const waveTableInitialState: LoadStoreSuccessPayload = {
  isFetching: false,
  tables: undefined
}

export const waveTable = (state = waveTableInitialState, action: LoadWaveTableAction) => {
  switch (action.type) {
    case 'LOAD_WAVE_TABLE_REQUEST':
      return {
        isFetching: state.isFetching,
        filePath: action.payload.filePath,
      }
    case 'LOAD_WAVE_TABLE_SUCCESS':
      if (state.tables) {
        return {
          isFetching: action.payload.isFetching,
          item: action.payload.table,
          tables: TableList.appendTable(state.tables, action.payload.table)
        }
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
