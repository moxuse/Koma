import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { PersistGate } from 'redux-persist/es/integration/react';
import { Provider } from 'react-redux';
import WaveTables from './components/WaveTables';
import { configReducer } from '../renderer/reducer';
import { restore } from './actions/waveTables/openStore';
import { midiOnRecieve } from './actions/midi';
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

window.api.on("onMIDIRecieve", (_, arg: { channel: number }) => {
  store.dispatch(midiOnRecieve(arg.channel));
  setTimeout(() => { 
    store.dispatch(midiOnRecieve(undefined));
  }, 100)
})

const AppContainer = styled.div`
  min-width: 500px;
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
