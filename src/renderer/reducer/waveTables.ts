import * as ReduxPersistConstants from 'redux-persist/lib/constants';
import { LoadWaveTableByDialogAction } from "../actions/waveTables/byDialog";
import { LoadWaveTableAction } from "../actions/waveTables";

import TableList from "../model/TableList";

type ActionType = LoadWaveTableAction | LoadWaveTableByDialogAction

const tablesInitialState = {
  isFetching: false,
  tables: new TableList(),
  error: undefined,
};

export const waveTables = (state = tablesInitialState, action: ActionType) => {
  switch (action.type) {
    case 'LOAD_WAVE_TABLE_REQUEST':
      return {
        isFetching: action.payload.isFetching,
        tables: state.tables,
        error: state.error
      };
    case 'LOAD_WAVE_TABLE_SUCCESS':
      const newTableList = TableList.appendSample(state.tables, action.payload.sample!);
      return {
        isFetching: action.payload.isFetching,
        tables: TableList.appendTable(newTableList, action.payload.table!),
        error: state.error
      };
    case 'LOAD_WAVE_TABLE_FAILURE':
      return {
        isFetching: action.payload.isFetching,
        tables: state.tables,
        error: action.payload.error
      };
    case 'LOAD_WAVE_TABLE_BY_DIALOG_REQUEST':
      return {
        isFetching: action.payload.isFetching,
        tables: state.tables,
        error: state.error
      };
    case 'LOAD_WAVE_TABLE_BY_DIALOG_SUCCESS':
      const newTable = TableList.appendTable(state.tables, action.payload.table!);
      return {
        isFetching: action.payload.isFetching,
        tables: TableList.appendSample(newTable, action.payload.sample!),
        error: state.error
      };
    case 'LOAD_WAVE_TABLE_BY_DIALOG_FAILURE':
      return {
        isFetching: action.payload.isFetching,
        tables: state.tables,
        error: action.payload.error
      };
    case 'DELETE_WAVE_TABLE_REQUEST':
      let target = TableList.deleteSample(state.tables, action.payload.sample!.getId());
      return {
        isFetching: false,
        tables: TableList.deleteTable(target, action.payload.table!.getId()),
        error: state.error
      };
    case 'UPDATE_WAVE_TABLE_BY_TABLE_REQUEST':
        return {
          isFetching: false,
          tables: TableList.updateTable(state.tables, action.payload.table!.getId(), action.payload.table!),
          error: state.error
        };
    case 'UPDATE_WAVE_TABLE_BY_SAMPLE_REQUEST':
      return {
        isFetching: false,
        tables: TableList.updateSample(state.tables, action.payload.sample!.getId(), action.payload.sample!),
        error: state.error
      };
    case ReduxPersistConstants.PERSIST:
      console.log('on PERSIST', state, action);
      return state;
    default:
      return state;
  };
};
