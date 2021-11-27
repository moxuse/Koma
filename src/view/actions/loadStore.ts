import TableList from '../model/TableList';

export const LOAD_STORE_REQUEST = 'DELETE_VIDEOS_REQUEST'
export const loadStoreRequest = () => {
    return { type: LOAD_STORE_REQUEST, isFetching: true }
}

export const LOAD_STORE_SUCCESS = 'DELETE_VIDEOS_SUCCESS'
const loadStoreSuccess = (tables: TableList) => {
  return {
    type: LOAD_STORE_SUCCESS,
    isFetching: false,
    tables: tables
  }
}

export const LOAD_STORE_FAILURE = 'LOAD_STORE_FAILURE'
const loadStoreFailure = (error: string) => {
  return {
    type: LOAD_STORE_FAILURE,
    isFetching: false,
    error: error
  }
}

export type LoadStoreAction = ReturnType<
    typeof loadStoreRequest |
    typeof loadStoreSuccess |
    typeof loadStoreFailure
>;

export const loadStore = () => {
  return (dispatch: any) => {
    dispatch(loadStoreRequest())
    
    return new Promise((resolve, reject) => {
      window.api.on('loadStoreSucseed', (_, arg: any[]) => {
        dispatch(loadStoreSuccess(
          new TableList(arg[0])
        ));
        resolve(arg[0]);
      });
      window.api.on('loadStoreFailed', (_, arg: any[]) => {
        dispatch(loadStoreFailure(arg[0]));
        reject(arg[0]);
      });
      window.api.loadStore();
    })    
  }
}
