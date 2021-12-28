import { ActionCreator, Dispatch } from 'redux';
// import { List } from 'immutable';
// import TableList from '../model/TableList';
// import Table from '../model/Table';

export interface LoadSettingRequest {
  type: 'LOAD_SETTING_REQUEST', payload: { isFetching: true }
};

export type LoadSettingPayload = {
  isFetching: boolean,
  mode: string,
  error: Error | undefined
};

export type BootedPayload = {
  booted: boolean,
  mode: string,
};

export interface BootedActioon { 
  type: 'BOOTED';
  payload: BootedPayload;
};

export interface LoadSettingSuccess {
  type: 'LOAD_SETTING_SUCCESS';
  payload: LoadSettingPayload;
};

export interface LoadSettingFailure {
  type: 'LOAD_SETTING_FAILURE',
  payload: LoadSettingPayload
};

export type LoadSettingAction =
  BootedActioon
  | LoadSettingRequest
  | LoadSettingSuccess
  | LoadSettingFailure;

/**
 * Action Creator
 */
export const bootedRequets: ActionCreator<LoadSettingAction> = (
  payload: BootedPayload
): LoadSettingAction => ({
  type: 'BOOTED',
  payload
});

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
};

export const booted = () => {
  return (dispatch: Dispatch<LoadSettingAction>) => {
    console.log('setting listen once')
    window.api.once('booted', (_, arg: { mode: string }) => {
      // console.log('dispatched...booted?')
      dispatch(bootedRequets({ mode: arg.mode }));
    });
  };
};

export const loadSetting = () => {
  return async (dispatch: Dispatch<LoadSettingAction>) => {
    dispatch(loadSettingRequest({
      isFetching: true,
    }));
    window.api.on!('loadSettingSucseed', (_, arg: {}) => {
      dispatch(loadSettingSuccess({
        isFetching: false,
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
  };
};
