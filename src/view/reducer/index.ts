import { combineReducers } from 'redux'
import { loadStore, tables } from './tables'
import { waveTable } from './waveTable';

const rootReducer = combineReducers({
  tables,
  loadStore,
  waveTable
})

export default rootReducer