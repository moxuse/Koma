import { combineReducers } from 'redux'
import { loadStore } from './store';
import { tables } from './tables'
import { waveTable } from './waveTable';
import { player } from './player';

const rootReducer = combineReducers({
  tables,
  loadStore,
  waveTable,
  player
})

export default rootReducer