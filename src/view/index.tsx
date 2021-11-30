import { IpcMainEvent } from 'electron';
import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import rootReducer from './reducer';
import WaveTables from './components/WaveTables';
import { loadStore } from './actions/loadStore';
import Table from './model/Table';

const DragAreaStyle = styled.div`
  -webkit-app-region: drag;
`;

const store = createStore(
  rootReducer,
  applyMiddleware(thunk, logger)
)

store.dispatch(loadStore());

const App = (): JSX.Element => {
  return (
    <DragAreaStyle>
      <Provider store = { store }>
        <div className = "App">
          <WaveTables></WaveTables>
        </div>
      </Provider>
    </DragAreaStyle>
  );
};

App.defaultProps = {
  props: new Table({ id: '01', filePath: '' })
};

ReactDOM.render(<App />, document.getElementById('app'));
