import { LoadStoreAction } from "../actions/loadStore";
import TableList from "../model/TableList";

const storeInitialState = {
  isFetching: false,
  tebles: new TableList()
}

export const loadStore = (state = storeInitialState, action: LoadStoreAction) => {
  switch (action.type) {
    case 'LOAD_STORE_REQUEST':
      return {
        isFetching: state.isFetching
      }
      break;
    case 'LOAD_STORE_SUCCESS':
      return {
        isFetching: action.payload?.isFetching,
        tables: action.payload.tables
      }
    case 'LOAD_STORE_FAILURE':
      return {
        isFetching: action.payload.isFetching,
        error: action.payload.error
      }
      break;
    default:
      return state;
  }
}