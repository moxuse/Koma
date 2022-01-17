import { createStore, combineReducers, applyMiddleware } from 'redux';
import { persistStore, persistReducer, createTransform } from 'redux-persist';
import storage from 'redux-persist/lib/storage'
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { loadSetting } from './setting';
import { waveTables } from './waveTables'
import { allocReadBuffer } from './buffer'
import { player } from './buffer/player';
import TableList from '../model/TableList';
import Table, { Slice } from '../model/Table';
import Sample from '../model/Sample';
import Effect from '../model/Effect';

const float32ArrayToBase64 = (f32: Float32Array) => {
  var uint8 = new Uint8Array(f32.buffer);
  return btoa(uint8.reduce(function(data, byte) {
      return data + String.fromCharCode(byte);
  }, ''));
}

const base64ToFloat32Array = (base64: string) => {
  var binary = atob(base64),
      len = binary.length,
      bytes = new Uint8Array(len),
      i;
  for(i = 0; i < len; i += 1) {
      bytes[i] = binary.charCodeAt(i);
  }
  return new Float32Array(bytes.buffer);
}

export const outboundsTransform = (outboundState: any,  key: any): any => {
  // console.log('outboundState', outboundState)
  let newTableList = new TableList();
  outboundState.waveTables.tables.forEach((t: Table) => {
    let table = new Table();
    table = table.set('id', t.id);
    table = table.set('mode', t.mode);
    table = table.set('name', t.name);
    table = table.set('sample', t.sample);
    table = table.set('effect', t.effect);
    table = table.set('bufnum', t.bufnum);
    table = table.set('slice', { begin: t.slice?.begin, end: t.slice?.end } as Slice);
    newTableList = TableList.appendTable(newTableList, table);
  })
  outboundState.waveTables.samples.forEach((s: Sample) => {
    let sample = new Sample();
    sample = sample.set('id', s.id);
    sample = sample.set('allocated', false);
    sample = sample.set('buffer', base64ToFloat32Array(s.buffer));
    sample = sample.set('filePath', s.filePath);
    newTableList = TableList.appendSample(newTableList, sample);
  })
  outboundState.waveTables.effects.forEach((e: Effect) => {
    let effect = new Effect();
    effect = effect.set('id', e.id);
    effect = effect.set('pan', e.pan);
    effect = effect.set('rate', e.rate);
    effect = effect.set('gain', e.gain);
    effect = effect.set('duration', e.duration);
    effect = effect.set('points', Object.values(e.points));
    effect = effect.set('trig', e.trig);
    newTableList = TableList.appendEffect(newTableList, effect);
  })
  
  const retunVal = {
    ...outboundState,
    tables: newTableList,
  };
  
  return retunVal
};

const TransformTables = createTransform(
  (inboundState: any, key): any => {
    const returnVal = {
      ...inboundState,
      tables: '__TABLES__',
      waveTables: {
        tables: inboundState.tables ? inboundState.tables.getTables().toJS().map((t: Table) => { 
          return {
            id: t['id'],
            mode: t['mode'],
            name: t['name'],
            bufnum: t['bufnum'],
            sample: t['sample'],
            effect: t['effect'],
            slice: { begin: t['slice']?.begin, end: t['slice']?.end }
          }
        }) : [],
        samples: inboundState.tables ? inboundState.tables.getSamples().toJS().map((s: Sample) => { 
          return {
            id: s['id'],
            allocated: false,
            filePath: s['filePath'],
            buffer: float32ArrayToBase64(s['buffer']!)
          }
        }) : [],
        effects: inboundState.tables ? inboundState.tables.getEffects().toJS().map((e: Effect) => {
          // console.log('inbound points', e['points'])
          return {
            id: e['id'],
            pan: e['pan'],
            rate: e['rate'],
            gain: e['gain'],
            points: e['points'],
            duration: e['duration'],
            trig: e['trig']
          }
        }) : []
      }
    }
    return returnVal;
  },
  outboundsTransform, {
    whitelist: ['waveTables', 'tables']
  }
);

const rootPersistConfig = {
  key: 'root',
  blacklist: ['player', 'allocReadBuffer', 'loadSetting' ],
  whitelist: ['waveTables'],
  storage: storage,
  transforms: [TransformTables],
  throttle: 10,
  debug: true,
};

const rootReducer = combineReducers({
  loadSetting,
  waveTables,
  allocReadBuffer,
  player
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer)

export const configReducer = () => {
  let store = createStore(persistedReducer, composeWithDevTools(applyMiddleware(thunk, logger)));
  
  let persistor = persistStore(store);
  return { store, persistor };
};
