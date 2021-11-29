import { ipcMain } from 'electron';
import { BrowserWindow } from 'electron/main';
import { dialog } from 'electron';
import * as WavDecoder from 'wav-decoder';
import TableList from '../view/model/TableList';
import * as Utils from './Utils';

// API register
export default function registerApi(window: BrowserWindow, isDev: boolean): void {
  /**
   * Load Store file
   * returns
   * 'loadStoreSucseed'
   * 'loadStoreFailed'
   */
  ipcMain.on('loadStore', (e) => {
    if (isDev) { console.log('loadstore!! in api'); }
    Utils.loadStore().then((tables: TableList) => {
      e.reply('loadStoreSucseed', tables);
    }).catch((err: any) => {      
      e.reply('loadStoreFailed', err);
    })
  })
  // window.api.loadStore();

  /**
   * Read Wav file from path
   * returns
   * 'openFileDialogCanceled'
   * 'openFileDialogSucseed'
   * 'openFileDialofFailed'
   */
  ipcMain.on('openFileDialog', (e) => {
    dialog.showOpenDialog( window, { properties: ["openFile", 'openDirectory'], filters: [{ name: "msplr", extensions: ["wav"] }] },
    ).then((result) => {
      if (result.canceled) { e.reply('openFileDialogCanceled') }
      
      Utils.readFile(result.filePaths[0]).then((buffer: Buffer) => {
        return WavDecoder.decode(buffer, {});
      }).then((audioData) => {
        e.reply('openFileDialogSucseed', result.filePaths);
        if (isDev) { console.log(audioData); }
      }).catch((err: any) => {
        e.reply('openFileDialofFailed', err);
      })
    })
  })
  // window.api.openFileDialog();

  /**
   * Read Wav file from path
   * returns
   * 'loadWaveTable'
   * 'loadWaveTableSucseed'
   * 'loadWaveTableFailed'
   */
  ipcMain.on('loadWaveTable', (e, filePath) => {
    Utils.readFile(filePath).then((buffer: Buffer) => {
      return WavDecoder.decode(buffer, {});
    }).then((audioData) => {
      e.reply('loadWaveTableSucseed', audioData);
      if (isDev) { console.log('loaded buffer:',audioData); }
    }).catch((err: any) => {
      e.reply('loadWaveTableFailed', err);
    })
  })
  // window.api.loadWaveTable(filePath);
}
