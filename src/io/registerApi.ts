import { ipcMain } from 'electron';
import { BrowserWindow } from 'electron/main';
import { dialog } from 'electron';
import WavDecoder from 'wav-decoder';
import * as Utils from './Utils';

// API register
export default function registerApi(window: BrowserWindow, isDev: boolean): void {
  /**
   * Read Wav file from path
   * returns
   * 'openFileDialogCanceled'
   * 'openFileDialogSucseed'
   * 'openFileDialofFiled'
   */
  ipcMain.on('openFileDialog', (e) => {
    dialog.showOpenDialog( window, { properties: ["openFile",   'openDirectory'], filters: [{ name: "msplr", extensions: ["wav"] }] },
    ).then((result) => {
      if (result.canceled) { e.reply('openFileDialogCanceled'); return }
      
      Utils.readFile(result.filePaths[0]).then((buffer: Buffer) => {
        return WavDecoder.decode(buffer, {});
      }).then((audioData) => {
        e.reply('openFileDialogSucseed', result.filePaths);
        if (isDev) { console.log(audioData); }
      }).catch((err: any) => {
        e.reply('openFileDialofFiled', err);
      })
    })
  })
  // window.api.openFileDialog();
}
