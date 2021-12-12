import { createStore, combineReducers, applyMiddleware } from 'redux';
import { persistStore, persistReducer, createTransform } from 'redux-persist';
// import immutableTransform from "redux-persist-transform-immutable";
import storage from 'redux-persist/lib/storage'
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { loadSetting } from './setting';
import { waveTables } from './waveTables'
import { player } from './player';
import TableList from '../model/TableList';

/**
 * 
 *  TODO: crrect transform!!!!!!!!!!!!! 
 * 
 */

const TransformTables = createTransform(
  (inboundState: TableList, key): any => {
    console.log('inboundState', inboundState)
    // const tables = inboundState.tables.map(t => { 
    //   console.log('outbounds...', t);
    //   return t
    // })
    // const samples = inboundState.samples.map(s => { 
    //   console.log('outbounds...', s);
    //   return s
    // })
    // const newTable = TableList.newFromTableList(inboundState.tables)
    return {
      ...inboundState,
      // waveTables: newTable,
    };
  },
  (outboundState: any, key): any => {
    console.log('OUTOUND..', outboundState.tables)
    const newTable = TableList.newFromTableList(outboundState.tables)
    console.log('outbounds',newTable, outboundState)
    return {
        isFetching: false,
        tables: newTable,
        error: undefined
    };
  }, {
    whitelist: ['waveTables']
  }
)

const rootPersistConfig = {
  key: 'root',
  blacklist: ['loadSetting', 'player'],
  storage: storage,
  transforms: [ TransformTables ]
}

const rootReducer = combineReducers({
  loadSetting,
  waveTables,
  player
})

const persistedReducer = persistReducer(rootPersistConfig, rootReducer)

export const configReducer = () => {
  let store = createStore(persistedReducer, composeWithDevTools(applyMiddleware(thunk, logger)));
  
  let persistor = persistStore(store)
  console.log('STORE========', persistor)
  return { store, persistor }
}
