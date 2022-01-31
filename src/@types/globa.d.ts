import { IpcMainEvent } from 'electron';
import Table from '../renderer/model/Table';

declare global {
  interface Window {
    api: ContextBridge;
  }

  type TableMode = 'normal' | 'grain';

  type MIDIAsssignArg = Array<{ mode: TableMode, bufnum: number, amp: number, rate: number, pan: number, gain: number, slice: { begin: number, end: number } | undefined, trig: number | undefined, duration: number | undefined, points: Array<{ x: number, y: number }> | undefined }>;

  type IcpEventArg =
    { mode: string } &
    { channel: number } &
    { tables: Table } &
    { bufnum: number, data: { ommited: Float32Array, detailed: Float32Array } } &    
    { bufnum: number, filePath: string, data: { omitted: Float32Array, detailed: Float32Array } } &
    { bufnum: number,
      slice: ({ begin: number, end: number } | undefined),
      effect: { amp: number, rate: number, pan: number, gain: number }} &
    { tables: Table[] } &
    { restoerData: any } &
    { data: MIDIAsssignArg } &
    Error;
  
  type IpcEvent = ((e: IpcMainEvent, arg: IcpEventArg) => void) | undefined;

  interface ContextBridge {
    loadSetting: () => void,
    loadWaveTableByDialog: () => void,
    loadWaveTable: (filePath: string) => void,
    playerRequest: (bufnum: number,
      slice: ({ begin: number, end: number } | undefined),
      effect: { amp: number, rate: number, pan: number, gain: number }
    ) => void,
    grainPlayerRequest: (bufnum: number,
      slice: ({ begin: number, end: number } | undefined),
      effect: { amp: number, rate: number, pan: number, gain: number, points: Array<{ x: number, y: number }>, duration: number, trig: number }
    ) => void,
    allocBufferRequest: (nufnum: number, filePath: string) => void,
    saveStore: () => void,
    openStore: () => void,
    midiAssign: (data: MIDIAsssignArg ) => void,
    on: (channel: string, callback: IpcEvent) => void;
    once: (channel: string, callback: IpcEvent) => void;
    removeAllListeners: (channel: string) => void;
  }
}


