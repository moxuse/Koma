import { combineReducers } from 'redux'
import { loadStore, tables } from './tables'
import { waveTables } from './waveTable';

const rootReducer = combineReducers({
  tables,
  loadStore,
  waveTables
})

export default rootReducer