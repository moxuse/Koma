import { List } from 'immutable';
import Table from "../model/Table";
import { ReadTableAction } from "../actions/loadWaveTableByDialog";

import TableList from "../model/TableList";

const tablesInitialState = {
  isFetching: false,
  tables: new TableList(),
}

export const tables = (state = tablesInitialState, action: ReadTableAction) => {
  switch (action.type) {
    case 'READ_TABLE_REQUEST':
      return {
        isFetching: action.payload.isFetching,
      }
    case 'READ_TABLE_SUCCESS':
      const t = TableList.appendTable(state.tables, action.payload.table);
      return {
        isFetching: action.payload.isFetching,
        tables: TableList.appendSample(t, action.payload.sample)
      }
    case 'READ_TABLE_FAILURE':
      return {
        isFetching: action.payload.isFetching,
        error: action.payload.error
      }      
    default:
      return state;
  }
}


