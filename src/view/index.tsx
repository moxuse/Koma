import { IpcMainEvent } from 'electron';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import rootReducer from './reducer';
import WaveTables from './components/WaveTables';
import { loadStore } from './actions/loadStore';
import Table from './model/Table';

const store = createStore(
  rootReducer,
  applyMiddleware(thunk, logger)
)

store.dispatch(loadStore());

const App = (): JSX.Element => {
  return (
    <Provider store = { store }>
      <div className = "App">
        <WaveTables></WaveTables>
      </div>
    </Provider>
  );
};

App.defaultProps = {
  props: new Table({ id: '01', filePath: '' })
};

ReactDOM.render(<App />, document.getElementById('app'));
