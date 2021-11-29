import { ContextBridge, IpcRenderer, IpcMainEvent } from 'electron';
import Table from '../view/model/Table';
import TableList from '../view/model/TableList';

declare global {
  interface Window {
    api: ContextBridge;
  }

  type IcpEventArg =
    { table: Table } &
    string[] &
    { tables: Table[] };
  
  type IpcEvent = (e: IpcMainEvent, arg: IcpEventArg) => void;

  interface ContextBridge {
    loadStore: () => void,
    openFileDialog: () => void,
    loadWaveTable: (filePath: string) => void,
    on: (channel: string, callback: IpcEvent) => void;
  }
}


