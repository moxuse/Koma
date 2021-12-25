const { contextBridge, ipcRenderer } = require('electron');

/**
 * register ipc event APIs
 **/ 
contextBridge.exposeInMainWorld(
  "api", {
    loadSetting: async () => ipcRenderer.send('loadSetting'),
    loadWaveTableByDialog: async () => ipcRenderer.send('loadWaveTableByDialog'),
    loadWaveTable: async (filePath: string) => ipcRenderer.send('loadWaveTable', filePath),
    playerRequest: async (bufnum: number) => ipcRenderer.send('playerRequest', bufnum),
    allocBufferRequest: async (bufnum: number, filePath: string) => ipcRenderer.send('allocBufferRequest', bufnum, filePath),

    on: (channel: string, callback: any) => ipcRenderer.on(channel, (event, argv) => callback(event, argv)),
    once: (channel: string, callback: any) => ipcRenderer.once(channel, (event, argv) => callback(event, argv)),
    removeAllListeners: (channel: string) => ipcRenderer.removeAllListeners(channel)
  }
);
