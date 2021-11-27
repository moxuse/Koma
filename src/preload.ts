const { contextBridge, ipcRenderer } = require('electron');

/**
 * register ipc event APIs
 **/ 
contextBridge.exposeInMainWorld(
  "api", {
    loadStore: async () => ipcRenderer.invoke('loadStore'),
    openFileDialog: async () => ipcRenderer.invoke('openFileDialog'),
    
    on: (channel: string, callback: any) => ipcRenderer.on(channel, (event, argv) => callback(event, argv))
  }
);
