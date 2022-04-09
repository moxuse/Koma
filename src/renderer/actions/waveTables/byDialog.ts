import { Dispatch } from 'redux';
import { LoadWaveTableRequestPayload } from './index';
import Table from '../../model/Table';
import Sample from '../../model/Sample';
import Effect from '../../model/Effect';
import { getNewId, omitFileName } from '../helper';

/**
 * Action Creator
 */
export const loadWaveTableByDialogRequest = (
  payload: LoadWaveTableRequestPayload,
) => ({
  type: 'LOAD_WAVE_TABLE_BY_DIALOG_REQUEST',
  payload: payload,
});

export const loadWaveTableByDialogSuccess = (
  payload: LoadWaveTableRequestPayload,
) => ({
  type: 'LOAD_WAVE_TABLE_BY_DIALOG_SUCCESS',
  payload: payload,
});

export const loadWaveTableByDialogFailure = (
  payload: LoadWaveTableRequestPayload,
) => ({
  type: 'LOAD_WAVE_TABLE_BY_DIALOG_FAILURE',
  payload: payload,
});

export type LoadWaveTableByDialogAction = (
  | ReturnType<typeof loadWaveTableByDialogRequest>
  | ReturnType<typeof loadWaveTableByDialogSuccess>
  | ReturnType<typeof loadWaveTableByDialogFailure>
);

const removeEvents = () => {
  window.api.removeAllListeners('loadWaveTableByDialogSucceed');
  window.api.removeAllListeners('loadWaveTableByDialogFailed');
};

export const loadWaveTableByDialog = () => {
  return (dispatch: Dispatch<LoadWaveTableByDialogAction>) => {
    dispatch(loadWaveTableByDialogRequest({
      isFetching: true,
      table: undefined,
      filePath: '',
      sample: undefined,
      effect: undefined,
      error: undefined,
    }));
    window.api.on!('loadWaveTableByDialogSucceed', (_, { bufnum, filePath, data }) => {
      const sampleId = getNewId();
      const s = new Sample({ id: sampleId, allocated: true, filePath, buffer: data.omitted });
      const t = new Table({
        id: getNewId(),
        mode: 'normal',
        name: omitFileName(filePath),
        bufnum: bufnum,
        sample: sampleId,
        effect: sampleId,
        slice: undefined,
      });
      let e = new Effect();
      e = e.set('id', sampleId);
      dispatch(loadWaveTableByDialogSuccess({
        isFetching: false,
        filePath: '',
        table: t,
        effect: e,
        sample: s,
        error: undefined,
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
          effect: undefined,
          error: arg,
        },
      ));
      removeEvents();
    });
    window.api.loadWaveTableByDialog();
  };
};
