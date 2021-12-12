import { IpcMainEvent } from 'electron';
import { AudioData } from 'wav-decoder';
import Table from '../view/model/Table';
import TableList from '../view/model/TableList';

declare global {
  interface Window {
    api: ContextBridge;
  }

  type IcpEventArg =
    { bufnum: number, data: AudioData } &
    { tables: Table } &
    { filePath: string, audioData: AudioData } &
    { bufnum: number } &
    { tables: Table[] } &
    Error;
  
  type IpcEvent = ((e: IpcMainEvent, arg: IcpEventArg) => void) | undefined;

  interface ContextBridge {
    loadSetting: () => void,
    loadWaveTableByDialog: () => void,
    loadWaveTable: (filePath: string) => void,
    playerRequest: (bufnum: number) => void,
    on: (channel: string, callback: IpcEvent) => void;
    removeAllListeners: (channel: string) => void;
  }
}


