import TableList from "../model/TableList";
import { LoadWaveTableAction } from "../actions/loadWaveTable";


const waveTableInitialState = {
  isFetching: false,
  tables: new TableList(),
}

export const waveTable = (state = waveTableInitialState, action: LoadWaveTableAction) => {
  switch (action.type) {
    case 'LOAD_WAVE_TABLE_REQUEST':
      return {
        isFetching: state.isFetching,
        filePath: action.payload.filePath,
        tables: state.tables
      }
    case 'LOAD_WAVE_TABLE_SUCCESS':
      const t = TableList.appendTable(state.tables, action.payload.table);
      return {
        isFetching: action.payload.isFetching,
        tables: TableList.appendSample(t, action.payload.sample)
      }
    case 'LOAD_WAVE_TABLE_FAILURE':
      return {
        isFetching: action.payload.isFetching,
        tables: state.tables,
        error: action.payload.error
      }      
    default:
      return state;
  }
}
