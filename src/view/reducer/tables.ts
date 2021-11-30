import { List } from 'immutable';
import Table from "../model/Table";
import { ReadTableAction } from "../actions/readTable";
import { LoadStoreAction } from "../actions/loadStore";

import TableList from "../model/TableList";

const storeInitialState = {
  isFetching: false,
  tables: undefined,
  error: undefined
}

export const loadStore = (state = storeInitialState, action: LoadStoreAction) => {
  switch (action.type) {
    case 'LOAD_STORE_REQUEST':
      return {
        isFetching: state.isFetching,
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

const tablesInitialState = {
  isFetching: false,
  item: [],
}

export const tables = (state = tablesInitialState, action: ReadTableAction) => {
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


