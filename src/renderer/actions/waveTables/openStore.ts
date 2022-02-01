import { Dispatch } from 'redux';
import TableList from '../../model/TableList';
// eslint-disable-next-line import/no-cycle
import { outboundsTransform } from '../../../renderer/reducer';

export interface OpenStorePayload {
  isFetching: boolean;
  tables: TableList | undefined;
  error: Error | undefined;
}

/**
 * Action Creator
 */
export const openStoreRequest = (
  payload: OpenStorePayload,
) => ({
  type: 'OPEN_STORE_REQUEST',
  payload,
});

export const openStoreSuccess = (
  payload: OpenStorePayload,
) => ({
  type: 'OPEN_STORE_SUCCESS',
  payload,
});

export const openStoreFailure = (
  payload: OpenStorePayload,
) => ({
  type: 'OPEN_STORE_FAILURE',
  payload,
});

export type OpenStoreAction = (
  | ReturnType<typeof openStoreRequest>
  | ReturnType<typeof openStoreSuccess>
  | ReturnType<typeof openStoreFailure>
);

const removeEvents = () => {
  window.api.removeAllListeners('openStoreSucseed');
  window.api.removeAllListeners('openStoreFailed');
};

export const openStore = () => {
  return (dispatch: Dispatch<OpenStoreAction>) => {
    dispatch(openStoreRequest({
      isFetching: true,
      tables: undefined,
      error: undefined,
    }));

    window.api.on!('openStoreFailed', (_, arg: Error) => {
      dispatch(openStoreFailure(
        {
          isFetching: false,
          tables: undefined,
          error: arg,
        },
      ));
      removeEvents();
    });
    window.api.openStore();
  };
};

export const restore = (restoerData: any) => {
  return (dispatch: Dispatch<OpenStoreAction>) => {
    dispatch(openStoreSuccess({
      isFetching: false,
      tables: outboundsTransform(restoerData.waveTables).tables,
      error: undefined,
    }));
  };
};
