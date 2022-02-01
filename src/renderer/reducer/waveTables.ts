/* eslint-disable no-case-declarations */
import * as ReduxPersistConstants from 'redux-persist/lib/constants';
import { LoadWaveTableAction } from '../actions/waveTables';
import { LoadWaveTableByDialogAction } from '../actions/waveTables/byDialog';
// eslint-disable-next-line import/no-cycle
import { OpenStoreAction } from '../actions/waveTables/openStore';

import TableList from '../model/TableList';

type ActionType = LoadWaveTableAction & LoadWaveTableByDialogAction & OpenStoreAction;

const tablesInitialState = {
  isFetching: false,
  tables: new TableList(),
  error: undefined,
};

export const waveTables = (state = tablesInitialState, action: ActionType) => {
  switch (action.type) {
    case 'LOAD_WAVE_TABLE_REQUEST':
      return {
        isFetching: action.payload.isFetching,
        tables: state.tables,
        error: state.error,
      };
    case 'LOAD_WAVE_TABLE_SUCCESS':
      let newTableList = TableList.appendSample(state.tables, action.payload.sample!);
      newTableList = TableList.appendEffect(newTableList, action.payload.effect!);
      return {
        isFetching: action.payload.isFetching,
        tables: TableList.appendTable(newTableList, action.payload.table!),
        error: state.error,
      };
    case 'LOAD_WAVE_TABLE_FAILURE':
      return {
        isFetching: action.payload.isFetching,
        tables: state.tables,
        error: action.payload.error,
      };
    case 'LOAD_WAVE_TABLE_BY_DIALOG_REQUEST':
      return {
        isFetching: action.payload.isFetching,
        tables: state.tables,
        error: state.error,
      };
    case 'LOAD_WAVE_TABLE_BY_DIALOG_SUCCESS':
      let newTable = TableList.appendTable(state.tables, action.payload.table!);
      newTable = TableList.appendEffect(newTable, action.payload.effect!);
      return {
        isFetching: action.payload.isFetching,
        tables: TableList.appendSample(newTable, action.payload.sample!),
        error: state.error,
      };
    case 'LOAD_WAVE_TABLE_BY_DIALOG_FAILURE':
      return {
        isFetching: action.payload.isFetching,
        tables: state.tables,
        error: action.payload.error,
      };
    case 'DELETE_WAVE_TABLE_REQUEST':
      let target = TableList.deleteSample(state.tables, action.payload.sample!.getId());
      target = TableList.deleteEffect(target, action.payload.effect!.getId());
      return {
        isFetching: false,
        tables: TableList.deleteTable(target, action.payload.table!.getId()),
        error: state.error,
      };
    case 'UPDATE_WAVE_TABLE_BY_TABLE_REQUEST':
      return {
        isFetching: false,
        tables: TableList.updateTable(state.tables, action.payload.table!.getId(), action.payload.table!),
        error: state.error,
      };
    case 'UPDATE_WAVE_TABLE_BY_SAMPLE_REQUEST':
      return {
        isFetching: false,
        tables: TableList.updateSample(state.tables, action.payload.sample!.getId(), action.payload.sample!),
        error: state.error,
      };
    case 'UPDATE_WAVE_TABLE_BY_EFFECT_REQUEST':
      return {
        isFetching: false,
        tables: TableList.updateEffect(state.tables, action.payload.effect!.getId(), action.payload.effect!),
        error: state.error,
      };
    case 'OPEN_STORE_REQUEST':
      return {
        isFetching: action.payload.isFetching,
        tables: state.tables,
        error: action.payload.error,
      };
    case 'OPEN_STORE_SUCCESS':
      return {
        isFetching: action.payload.isFetching,
        tables: action.payload.tables,
        error: action.payload.error,
      };
    case 'OPEN_STORE_FAILURE':
      return {
        isFetching: state.isFetching,
        tables: state.tables,
        error: action.payload.error,
      };
    case ReduxPersistConstants.PERSIST:
      console.log('on PERSIST', state, action);
      return state;
    default:
      return state;
  }
};
