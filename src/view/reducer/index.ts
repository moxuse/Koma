import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { persistStore, persistReducer, createTransform } from 'redux-persist';
// import immutableTransform from "redux-persist-transform-immutable";
import { Record } from 'immutable'; 
import storage from 'redux-persist/lib/storage'
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { loadSetting } from './setting';
import { waveTables } from './waveTables'
import { player } from './player';
import { List } from 'immutable';
import TableList from '../model/TableList';
import Table, { Slice } from '../model/Table';
import Sample from '../model/Sample';

const TransformTables = createTransform(
  (inboundState: any, key): any => {
    const returnVal = {
      ...inboundState,
      waveTables: {
        tables: inboundState.tables ? inboundState.tables.getTables().toJS().map((t: Table) => { 
          return {
            id: t['id'],
            name: t['name'],
            bufnum: t['bufnum'],
            sample: t['sample'],
            slice: { begin: t['slice']?.begin, end: t['slice']?.end }
          }
        }) : [],
        samples: inboundState.tables ? inboundState.tables.getSamples().toJS().map((s: Sample) => { 
          return {
            id: s['id'],
            allocated: false,
            filePath: s['filePath'],
            buffer: s['buffer']
          }
        }) : []
      }
    }
    return returnVal;
  },
  (outboundState: any, key): any => {
    // console.log('outboundState', outboundState)
    let newTableList = new TableList();
    outboundState.waveTables.tables.forEach((t: Table) => {
      let table = new Table();
      table = table.set('id', t.id);
      table = table.set('name', t.name);  
      table = table.set('sample', t.sample);
      table = table.set('bufnum', t.bufnum);
      table = table.set('slice', { begin: t.slice?.begin, end: t.slice?.end } as Slice);
      newTableList = TableList.appendTable(newTableList, table);
    })
    outboundState.waveTables.samples.forEach((s: Sample) => {
      let sample = new Sample();
      sample = sample.set('id', s.id);
      sample = sample.set('allocated', false);
      sample = sample.set('buffer', Object.values(s.buffer));
      sample = sample.set('filePath', s.filePath);
      newTableList = TableList.appendSample(newTableList, sample);
    })
    
    const retunVal = {
      ...outboundState,
      tables: newTableList,
    };
    
    return retunVal
  }, {
    whitelist: ['waveTables', 'tables']
  }
);

const rootPersistConfig = {
  key: 'root',
  blacklist: ['player'],
  whitelist: ['waveTables'],
  storage: storage,
  transforms: [TransformTables],
  throttle: 200,
  debug: true,
};

const rootReducer = combineReducers({
  // loadSetting,
  waveTables,
  player
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer)

export const configReducer = () => {
  let store = createStore(persistedReducer, composeWithDevTools(applyMiddleware(thunk, logger)));
  
  let persistor = persistStore(store);
  return { store, persistor };
}
