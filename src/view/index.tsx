import { IpcMainEvent } from 'electron';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

import './styles.css';

const App = (): JSX.Element => {
  useEffect(() => {
    window.api.on('nyan', (_: IpcMainEvent, arg: any[]) => {
      console.log(arg);
    })    
    window.api.nyan('fooo!');
  }, []);

  return (
    <div>
      <h1>Hello.</h1>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('app'));
