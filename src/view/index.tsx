import { IpcMainEvent } from 'electron';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import WaveTables from './components/WaveTables';

const App = (): JSX.Element => {
  useEffect(() => {
    window.api.on('nyan', (_: IpcMainEvent, arg: any[]) => {
      console.log(arg);
    })    
    window.api.nyan('fooo!');
  }, []);
  
  return (
    <div>
      <WaveTables {...[{id: 'fooo'}]} />
    </div>
  );
};

App.defaultProps = {
  props: [{ id: 'fooo' }]
};

ReactDOM.render(<App />, document.getElementById('app'));
