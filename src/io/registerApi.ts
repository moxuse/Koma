import { ipcMain } from 'electron';
import { BrowserWindow } from 'electron/main';
import { dialog } from 'electron';
import fs from "fs";

// API register
export default function registerApi(window: BrowserWindow, isDev: boolean): void {
  ipcMain.on('openFileDialog', () => {
    dialog.showOpenDialog(window, { properties: ["openFile",   'openDirectory'], filters: [{ name: "msplr", extensions: ["wav"] }] },
    ).then((result) => { console.log('open file.. ', result) })
  })
  // window.api.openFileDialog();

  ipcMain.on('nyan', (e, arg) => {
    if (isDev) { console.log(arg) };
    e.reply('nyan', 'pong!');
  });
  // window.api.nyan("fooo");

}
