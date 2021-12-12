import { LoadSettingAction, LoadSettingPayload } from "../actions/setting";
import TableList from "../model/TableList";

const settingInitialState: LoadSettingPayload = {
  isFetching: false,
  tables: new TableList(),
  error: undefined,
}

export const loadSetting = (state = settingInitialState, action: LoadSettingAction) => {
  switch (action.type) {
    case 'LOAD_SETTING_REQUEST':
      return {
        isFetching: state.isFetching,
        tables: state.tables,
        error: state.error
      }
    case 'LOAD_SETTING_SUCCESS':
      return {
        isFetching: action.payload.isFetching,
        tables: action.payload.tables,
        error: state.error
      }
    case 'LOAD_SETTING_FAILURE':
      return {
        isFetching: action.payload.isFetching,
        tables: state.tables,
        error: action.payload.error
      }
    default:
      return state;
  }
}