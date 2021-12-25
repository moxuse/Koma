import { Dispatch } from 'redux';
import { LoadWaveTableRequestPayload } from './index';
import Table from '../../model/Table';
import Sample from '../../model/Sample';
import { getNewId, ommitFileName } from '../helper';

export type ItemPayload = {
  isFetching: boolean;
  table: Table | undefined;
  sample: Sample | undefined;
  error: Error | undefined;
};

/**
 * Action Creator
 */
export const loadWaveTableByDialogRequest = (
  payload: LoadWaveTableRequestPayload
) => ({
  type: 'LOAD_WAVE_TABLE_BY_DIALOG_REQUEST',
  payload
});

export const loadWaveTableByDialogSuccess = (
  payload: LoadWaveTableRequestPayload
) => ({
  type: 'LOAD_WAVE_TABLE_BY_DIALOG_SUCCESS',
  payload
});

export const loadWaveTableByDialogFailure = (
  payload: LoadWaveTableRequestPayload
) => ({
  type: 'LOAD_WAVE_TABLE_BY_DIALOG_FAILURE',
  payload
});

export type LoadWaveTableByDialogAction = (
  | ReturnType<typeof loadWaveTableByDialogRequest>
  | ReturnType<typeof loadWaveTableByDialogSuccess>
  | ReturnType<typeof loadWaveTableByDialogFailure>
);

const removeEvents = () => {
  window.api.removeAllListeners('loadWaveTableByDialogSucseed');
  window.api.removeAllListeners('loadWaveTableByDialogFailed');
};

export const loadWaveTableByDialog = () => {
  return (dispatch: Dispatch<LoadWaveTableByDialogAction>) => {
    dispatch(loadWaveTableByDialogRequest({
      isFetching: true,
      table: undefined,
      filePath: '',
      sample: undefined,
      error: undefined
    }));
    window.api.on!('loadWaveTableByDialogSucseed', (_, { bufnum, filePath, data }) => {
      const sampleId = getNewId();
      const s = new Sample({ id: sampleId, allocated: true, filePath, buffer: data.omitted });
      const t = new Table({
        id: getNewId(),
        name: ommitFileName(filePath),
        bufnum: bufnum,
        sample: sampleId,
        slice: undefined
      });
      dispatch(loadWaveTableByDialogSuccess({
        isFetching: false,
        filePath: '',
        table: t,
        sample: s,
        error: undefined
      }));
      removeEvents();
    });
    window.api.on!('loadWaveTableByDialogFailed', (_, arg: Error) => {
      dispatch(loadWaveTableByDialogFailure(
        {
          isFetching: false,
          filePath: '',
          table: undefined,
          sample: undefined,
          error: arg
        }
      ));
      removeEvents();
    });
    window.api.loadWaveTableByDialog();
  };
};
