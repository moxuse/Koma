import { combineReducers } from 'redux'
import { loadStore } from './store';
import { tables } from './tables'
import { waveTable } from './waveTable';

const rootReducer = combineReducers({
  tables,
  loadStore,
  waveTable
})

export default rootReducer