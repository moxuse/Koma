const { contextBridge, ipcRenderer } = require('electron');

/**
 * register ipc event APIs
 **/ 
contextBridge.exposeInMainWorld(
  "api", {
    loadStore: async () => ipcRenderer.send('loadStore'),
    openFileDialog: async () => ipcRenderer.send('openFileDialog'),
    loadWaveTable: async (filePath: string) => ipcRenderer.send('loadWaveTable', filePath),

    on: (channel: string, callback: any) => ipcRenderer.on(channel, (event, argv) => callback(event, argv))
  }
);
