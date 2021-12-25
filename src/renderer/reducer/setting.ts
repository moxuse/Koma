import { LoadSettingAction, LoadSettingPayload, BootedPayload } from "../actions/setting";
// import TableList from "../model/TableList";

const settingInitialState: LoadSettingPayload & BootedPayload = {
  booted: false,
  isFetching: false,
  mode: 'internal',
  error: undefined,
};

export const loadSetting = (
  state = settingInitialState, action: LoadSettingAction
) => {
  switch (action.type) {
    case 'BOOTED':
      return {
        booted: true,
        isFetching: state.isFetching,
        mode: action.payload.mode,
        error: state.error
      };
    case 'LOAD_SETTING_REQUEST':
      return {
        booted: state.booted,
        isFetching: state.isFetching,
        mode: state.mode,
        error: state.error
      };
    case 'LOAD_SETTING_SUCCESS':
      return {
        booted: state.booted,
        isFetching: action.payload.isFetching,
        mode: state.mode,
        error: state.error
      };
    case 'LOAD_SETTING_FAILURE':
      return {
        booted: state.booted,
        isFetching: action.payload.isFetching,
        mode: state.mode,
        error: action.payload.error
      };
    default:
      return state;
  };
};
