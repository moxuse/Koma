import { ActionCreator, Dispatch, Action } from 'redux';
import Table from '../model/Table';

export type ItemPayload = {
  isFetching: true;
  item: Table;
};

export interface ReadTableRequest extends Action {
  type: 'READ_TABLE_REQUEST',
  payload: ItemPayload
}

export interface ReadTableSuccess extends Action {
  type: 'READ_TABLE_SUCCESS',
  payload: ItemPayload
}

export type ErrorPayload = {
  isFetching: true;
  error: string;
};

export interface ReadTableFailure extends Action {
  type: 'READ_TABLE_FAILURE',
  payload: ErrorPayload
}

export type ReadTableAction = ReadTableRequest | ReadTableSuccess | ReadTableFailure;

/**
 * Action Creator
 */
export const readTableRequest: ActionCreator<ReadTableAction> = (
  payload: ItemPayload
): ReadTableAction => ({
  type: 'READ_TABLE_REQUEST',
  payload
} as ReadTableAction);

export const readTableSuccess: ActionCreator<ReadTableAction> = (
  payload: ItemPayload
): ReadTableAction => ({
  type: 'READ_TABLE_SUCCESS',
  payload 
} as ReadTableAction);

export const readTableFailure: ActionCreator<ReadTableAction> = (
  payload: ErrorPayload
): ReadTableAction => ({
  type: 'READ_TABLE_FAILURE',
  payload 
} as ReadTableAction);
  

export const readTable = () => {
  return (dispatch: any) => {
    dispatch(readTableRequest())
    return new Promise((resolve, reject) => {
      window.api.on('openFileDialogSucseed', (_, arg: any[]) => {
        dispatch(readTableSuccess(
          new Table({ id: '' + Math.random(), filePath: arg[0] })
        ));
        resolve(arg[0]);
      });
      window.api.on('openFileDialofFailed', (_, arg: any[]) => {
        dispatch(readTableFailure(arg[0]));
        reject(arg[0]);
      });
      window.api.openFileDialog();
    })
  }
}
