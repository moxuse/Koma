import { ActionCreator, Dispatch, Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { List } from 'immutable';
import TableList from '../model/TableList';
import Table from '../model/Table';

export interface LoadStoreRequest {
  type: 'LOAD_STORE_REQUEST', payload: { isFetching: true }
}

type LoadStoreSuccessPayload = {
  isFetching: boolean,
  tables: TableList
}

export interface LoadStoreSuccess {
  type: 'LOAD_STORE_SUCCESS';
  payload: LoadStoreSuccessPayload;
}

type LoadStoreErrorPayload = {
  isFetching: boolean,
  error: string
}

export interface LoadStoreFailure {
  type: 'LOAD_STORE_FAILURE',
  payload: LoadStoreErrorPayload
}

export type LoadStoreAction = LoadStoreRequest | LoadStoreSuccess | LoadStoreFailure;

/**
 * Action Creator
 */
 export const loadStoreRequest: ActionCreator<LoadStoreAction> = (): LoadStoreAction => ({
  type: 'LOAD_STORE_REQUEST',
  payload: { isFetching: true }
} as LoadStoreAction);

export const loadStoreSuccess: ActionCreator<LoadStoreAction> = (
  payload: LoadStoreSuccessPayload
): LoadStoreAction => ({
  type: 'LOAD_STORE_SUCCESS',
  payload: payload
} as LoadStoreAction);

export const loadStoreFailure: ActionCreator<LoadStoreAction> = (
  payload: LoadStoreErrorPayload
): LoadStoreAction => ({
  type: 'LOAD_STORE_FAILURE',
  payload: payload
} as LoadStoreAction);

export const loadStore = () => {
  return async (dispatch: Dispatch<LoadStoreAction>) => {
    dispatch(loadStoreRequest({
      isFetching: true,
    }))
    window.api.on('loadStoreSucseed', (_, arg: { tables: Table[] }) => {
      const list: TableList = TableList.newFromTable(List(arg.tables));
      dispatch(loadStoreSuccess({
        isFetching: false,
        tables: list
      }));
    });
    window.api.on('loadStoreFailed', (_, error) => {
      dispatch(loadStoreFailure({
        isFetching: false,
        error: error
      }));
    });
    window.api.loadStore();
  }
}
