import { List } from 'immutable';
import Table from "../model/table";
import { ReadTableAction } from "../actions/readTable";
import { LoadStoreAction } from "../actions/loadStore";

import {
  READ_TABLE_REQUEST, READ_TABLE_SUCCESS, READ_TABLE_FAILURE
} from '../actions/readTable';
import {
  LOAD_STORE_REQUEST, LOAD_STORE_SUCCESS, LOAD_STORE_FAILURE
} from '../actions/loadStore';
import TableList from "../model/TableList";

type TablesAction = ReadTableAction | LoadStoreAction;

// const init = List(new Table({id:'', filePath: ''}));

const initalState = {
  isFetching: false,
  tables: [],
}

const tables = (state = initalState, action: any) => {
  switch (action.type) {
    case LOAD_STORE_REQUEST:
      return {
          isFetching: true
        }
    case LOAD_STORE_SUCCESS:
      return {
        isFetching: false,
        tables: action.tables
      }
    case LOAD_STORE_FAILURE:
      return {
        isFetching: false,
        tables: action.items
      }
    case READ_TABLE_REQUEST:
      return {
        isFetching: true
      }
    case READ_TABLE_SUCCESS:
      return {
          isFetching: false,
          item: action.item
        }
    case READ_TABLE_FAILURE:
      return {
          isFetching: false,
          error: action.error
      }      
    default:
      return state
  }
}

export default tables;
