const { contextBridge, ipcRenderer } = require('electron');

/**
 * register ipc event APIs
 **/ 
contextBridge.exposeInMainWorld(
  "api", {
    openFileDialog: async () => ipcRenderer.send('openFileDialog'),
    nyan: async (data: string) => ipcRenderer.send('nyan', data),
    
    on: (channel: string, callback: any) => ipcRenderer.on(channel, (event, argv) => callback(event, argv))
  }
);
