import { ActionCreator, Dispatch, Action } from 'redux';
import { List } from 'immutable';
import TableList from '../model/TableList';
import Table from '../model/Table';

export interface LoadSettingRequest {
  type: 'LOAD_SETTING_REQUEST', payload: { isFetching: true }
}

export type LoadSettingPayload = {
  isFetching: boolean,
  tables: TableList | undefined,
  error: Error | undefined
}

export interface LoadSettingSuccess {
  type: 'LOAD_SETTING_SUCCESS';
  payload: LoadSettingPayload;
}

export interface LoadSettingFailure {
  type: 'LOAD_SETTING_FAILURE',
  payload: LoadSettingPayload
}

export type LoadSettingAction = LoadSettingRequest | LoadSettingSuccess | LoadSettingFailure;

/**
 * Action Creator
 */
 export const loadSettingRequest: ActionCreator<LoadSettingAction> = (): LoadSettingAction => ({
  type: 'LOAD_SETTING_REQUEST',
  payload: { isFetching: true }
});

export const loadSettingSuccess: ActionCreator<LoadSettingAction> = (
  payload: LoadSettingPayload
): LoadSettingAction => ({
  type: 'LOAD_SETTING_SUCCESS',
  payload: payload
});

export const loadSettingFailure: ActionCreator<LoadSettingAction> = (
  payload: LoadSettingPayload
): LoadSettingAction => ({
  type: 'LOAD_SETTING_FAILURE',
  payload: payload
});

const removeEvents = () => {
  window.api.removeAllListeners('loadSettingSucseed');
  window.api.removeAllListeners('loadSettingFailed');
}

export const loadSetting = () => {
  return async (dispatch: Dispatch<LoadSettingAction>) => {
    dispatch(loadSettingRequest({
      isFetching: true,
    }))
    window.api.on!('loadSettingSucseed', (_, arg: { tables: Table[] }) => {
      const list: TableList = TableList.newFromTableList(List(arg.tables));
      dispatch(loadSettingSuccess({
        isFetching: false,
        tables: list
      }));
      removeEvents();
    });
    window.api.on!('loadSettingFailed', (_, error) => {
      dispatch(loadSettingFailure({
        isFetching: false,
        error: error
      }));
      removeEvents();
    });
    window.api.loadSetting();
  }
}
