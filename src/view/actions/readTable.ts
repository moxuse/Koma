import Table from '../model/Table';

export const READ_TABLE_REQUEST = 'READ_TABLE_REQUEST';
export const readTableRequest = () => {
  return {    
    type: READ_TABLE_REQUEST,
    isFetching: true
  }
}

export const READ_TABLE_SUCCESS = 'READ_TABLE_SUCCESS';
const readTableSuccess = (response: Table) => {
  return {
    type: READ_TABLE_SUCCESS,
    isFetching: false,
    item: response
  }
}

export const READ_TABLE_FAILURE = 'READ_TABLE_FAILURE';
const readTableFailure = (error: string) => {
  return {
    type: READ_TABLE_FAILURE,
    isFetching: false,
    error: error
  }
}

export type ReadTableAction = ReturnType<
    typeof readTableRequest |
    typeof readTableSuccess |
    typeof readTableFailure
>;

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
