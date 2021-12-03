import { ActionCreator, Dispatch, Action } from 'redux';
import { ThunkAction } from 'redux-thunk'; 
import Table from '../model/Table';

type LoadWaveTableRequestPayload = {
  isFetching: boolean,
  filePath: string
}

export interface LoadWaveTableRequest {
  type: 'LOAD_WAVE_TABLE_REQUEST',
  payload: LoadWaveTableRequestPayload
}

type LoadWaveTableSuccessPayload = {
  isFetching: boolean,
  table: Table
}

export interface LoadWaveTableSuccess {
  type: 'LOAD_WAVE_TABLE_SUCCESS';
  payload: LoadWaveTableSuccessPayload;
}

type LoadWaveTableErrorPayload = {
  isFetching: boolean,
  error: string
}

export interface LoadWaveTableFailure {
  type: 'LOAD_WAVE_TABLE_FAILURE',
  payload: LoadWaveTableErrorPayload
}

export type LoadWaveTableAction = LoadWaveTableRequest | LoadWaveTableSuccess | LoadWaveTableFailure;

/**
 * Action Creator
 */
export const loadWaveTableRequest: ActionCreator<LoadWaveTableAction> = (
   payload: LoadWaveTableRequestPayload
 ): LoadWaveTableAction => ({
  type: 'LOAD_WAVE_TABLE_REQUEST',
  payload: { isFetching: true }
} as LoadWaveTableAction);

export const loadWaveTableSuccess: ActionCreator<LoadWaveTableAction> = (
  payload: LoadWaveTableSuccessPayload
): LoadWaveTableAction => ({
  type: 'LOAD_WAVE_TABLE_SUCCESS',
  payload: payload
} as LoadWaveTableAction);

export const loadWaveTableFailure: ActionCreator<LoadWaveTableAction> = (
  payload: LoadWaveTableErrorPayload
): LoadWaveTableAction => ({
  type: 'LOAD_WAVE_TABLE_FAILURE',
  payload: payload
} as LoadWaveTableAction);

export const loadWaveTable = (filePath: string): ThunkAction<void, any, undefined, LoadWaveTableAction> => (
  dispatch: Dispatch<Action>
) => {
  dispatch(loadWaveTableRequest({
    isFetching: true,
    filePath: filePath
  }))
  window.api.on('loadWaveTableSucseed', (_, arg: { table: Table }) => {
    const t = new Table(arg.table);
    dispatch(loadWaveTableSuccess({
      isFetching: false,
      table: t
    }));
  });
  window.api.on('loadWaveTableFailed', (_, error) => {
    dispatch(loadWaveTableFailure({
      isFetching: false,
      error: error
    }));
  });
  window.api.loadWaveTable(filePath);
}
