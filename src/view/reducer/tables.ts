import { List } from 'immutable';
import Table from "../model/table";
import { ReadTableAction } from "../actions/readTable";
import { LoadStoreAction } from "../actions/loadStore";

import TableList from "../model/TableList";

const storeInitalState = {
  isFetching: false,
  tables: undefined,
}

export const loadStore = (state = storeInitalState, action: LoadStoreAction) => {
  console.log('redux:0', state, action.type, action.payload);
  switch (action.type) {
    case 'LOAD_STORE_REQUEST':
      return {
        isFetching: action.payload.isFetching,
      }
    case 'LOAD_STORE_SUCCESS':
      return {
        isFetching: action.payload.isFetching,
        tables: action.payload.tables,
      }
    case 'LOAD_STORE_FAILURE':
      return {
        isFetching: action.payload.isFetching,
        error: action.payload.error
      }
    default:
      return state;
  }
}

const tablesInitalState = {
  isFetching: false,
  item: [],
}

export const tables = (state = tablesInitalState, action: ReadTableAction) => {
  switch (action.type) {
    case 'READ_TABLE_REQUEST':
      return {
        isFetching: state.isFetching,
      }
    case 'READ_TABLE_SUCCESS':
      return {
        isFetching: action.payload.isFetching,
        item: action.payload.item
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


