/* eslint-disable no-case-declarations */
import * as ReduxPersistConstants from 'redux-persist/lib/constants';
import { LoadWaveTableAction } from '../actions/waveTables';
import { LoadWaveTableByDialogAction } from '../actions/waveTables/byDialog';
// eslint-disable-next-line import/no-cycle
import { OpenStoreAction } from '../actions/waveTables/openStore';
import { getNewId } from '../actions/helper';

import TableList from '../model/TableList';
import Table from '../model/Table';

type ActionType = LoadWaveTableAction & LoadWaveTableByDialogAction & OpenStoreAction;

const tablesInitialState = {
  isFetching: false,
  tables: new TableList(),
  error: undefined,
};

export const waveTables = (state = tablesInitialState, action: ActionType) => {
  switch (action.type) {
    case 'ADD_EMPTY_WAVE_TABLE_REQUEST':
      let newTables = TableList.appendTable(state.tables, action.payload.table!);
      newTables = TableList.appendSample(newTables, action.payload.sample!);
      newTables = TableList.appendEffect(newTables, action.payload.effect!);
      return {
        isFetching: false,
        tables: newTables,
        error: state.error,
      };
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
      let newTable = TableList.updateTable(state.tables, action.payload.table!.getId()!, action.payload.table!);
      newTable = TableList.updateEffect(newTable, action.payload.effect!.getId()!, action.payload.effect!);
      newTable = TableList.updateSample(newTable, action.payload.sample!.getId()!, action.payload.sample!);
      return {
        isFetching: action.payload.isFetching,
        tables: newTable,
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
      const t = {
        isFetching: false,
        tables: TableList.updateSample(state.tables, action.payload.sample!.getId(), action.payload.sample!),
        error: state.error,
      };
      return t;
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
