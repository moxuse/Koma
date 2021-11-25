import { IpcMainEvent } from 'electron';
import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

import './styles.css';

const App = (): JSX.Element => {
  const appRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.api.on('nyan', (e: IpcMainEvent, arg: any[]) => {
      console.log(arg);
    })    
    window.api.nyan('Ping!');
  }, []);

  return (
    <div ref={appRef}>
      <h1>Hello.</h1>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('app'));
