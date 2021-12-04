const { contextBridge, ipcRenderer } = require('electron');

/**
 * register ipc event APIs
 **/ 
contextBridge.exposeInMainWorld(
  "api", {
    loadStore: async () => ipcRenderer.send('loadStore'),
    loadWaveTableByDialog: async () => ipcRenderer.send('loadWaveTableByDialog'),
    loadWaveTable: async (filePath: string) => ipcRenderer.send('loadWaveTable', filePath),

    on: (channel: string, callback: any) => ipcRenderer.on(channel, (event, argv) => callback(event, argv)),
    removeAllListeners: (channel: string) => ipcRenderer.removeAllListeners(channel)
  }
);
