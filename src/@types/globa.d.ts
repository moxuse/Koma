import { ContextBridge, IpcRenderer, IpcMainEvent } from 'electron';

declare global {
  interface Window {
    api: ContextBridge;
  }

  type IpcEvent = (e: IpcMainEvent, arg: any[]) => void;

  interface ContextBridge {
    nyan: any,
    on: (channel: string , callback: IpcEvent) => void
  }
}

 