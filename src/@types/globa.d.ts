import { IpcMainEvent } from 'electron';
import { AudioData } from 'wav-decoder';
import Table from '../renderer/model/Table';
import TableList from '../renderer/model/TableList';

declare global {
  interface Window {
    api: ContextBridge;
  }

  type IcpEventArg =
    { mode: string } &
    { tables: Table } &
    { bufnum: number, data: { ommited: Float32Array, detailed: Float32Array} } &    
    { bufnum: number, filePath: string, data: { omitted: Float32Array, detailed: Float32Array} } &
    { bufnum: number } &
    { tables: Table[] } &
    Error;
  
  type IpcEvent = ((e: IpcMainEvent, arg: IcpEventArg) => void) | undefined;

  interface ContextBridge {
    loadSetting: () => void,
    loadWaveTableByDialog: () => void,
    loadWaveTable: (filePath: string) => void,
    playerRequest: (bufnum: number) => void,
    allocBufferRequest: (nufnum: number, filePath: string) => void,
    on: (channel: string, callback: IpcEvent) => void;
    once: (channel: string, callback: IpcEvent) => void;
    removeAllListeners: (channel: string) => void;
  }
}


