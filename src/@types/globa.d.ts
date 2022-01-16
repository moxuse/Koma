import { IpcMainEvent } from 'electron';
import { AudioData } from 'wav-decoder';
import Table, { TableMode } from '../renderer/model/Table';
import Effect from '../renderer/model/Effect';
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
    { bufnum: number,
      slice: ({ begin: number, end: number } | undefined),
      effect: { rate: number, pan: number, gain: number }} &
    { tables: Table[] } &
    { restoerData: any } &
    Error;
  
  type IpcEvent = ((e: IpcMainEvent, arg: IcpEventArg) => void) | undefined;

  interface ContextBridge {
    loadSetting: () => void,
    loadWaveTableByDialog: () => void,
    loadWaveTable: (filePath: string) => void,
    playerRequest: (bufnum: number,
      slice: ({ begin: number, end: number } | undefined),
      effect: { rate: number, pan: number, gain: number }
    ) => void,
    grainPlayerRequest: (bufnum: number,
      slice: ({ begin: number, end: number } | undefined),
      effect: { rate: number, pan: number, gain: number, points: Array<{x: number, y: number}>, duration: number, trig: number }
    ) => void,
    allocBufferRequest: (nufnum: number, filePath: string) => void,
    saveStore: () => void,
    openStore: () => void,
    on: (channel: string, callback: IpcEvent) => void;
    once: (channel: string, callback: IpcEvent) => void;
    removeAllListeners: (channel: string) => void;
  }
}


