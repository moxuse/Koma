import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { PersistGate } from 'redux-persist/es/integration/react';
import { Provider } from 'react-redux';
import WaveTables from './components/WaveTables';
import { configReducer } from '../renderer/reducer';
import { restore } from './actions/waveTables/openStore';
const { store, persistor } = configReducer();

const DragAreaStyle = styled.div`
  -webkit-app-region: drag;
`;

window.api.on!('openStoreSucseed', (_, { restoerData }) => {
  if (restoerData) {
    persistor.purge();
    store.dispatch(restore(restoerData));
  }
});

const AppContainer = styled.div`
  min-width: 450px;
  margin-top: 40px;
`;

const App = (): JSX.Element => {
  return (
    <DragAreaStyle>
      <Provider store={store}>
        <PersistGate loading={<div>Loading..</div>} persistor={persistor}>
          <AppContainer className="App">
            <WaveTables></WaveTables>
          </AppContainer>
        </PersistGate>
      </Provider>
    </DragAreaStyle >
  );
};

ReactDOM.render(<App />, document.getElementById('app'));
