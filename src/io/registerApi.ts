import { ipcMain } from 'electron';
import { BrowserWindow } from 'electron/main';
import { dialog } from 'electron';
import * as WavDecoder from 'wav-decoder';
import TableList from '../view/model/TableList';
import * as Utils from './Utils';

// API register
export default function registerApi(window: BrowserWindow, isDev: boolean): void {
  console.log('register events for the api');
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
   * 'loadWaveTableByDialogCanceled'
   * 'loadWaveTableByDialogSucseed'
   * 'loadWaveTableByDialogFailed'
   */
  ipcMain.on('loadWaveTableByDialog', (e) => {
    dialog.showOpenDialog(window, { properties: ["openFile", 'openDirectory'], filters: [{ name: "msplr", extensions: ["wav"] }] },
    ).then((result) => {
      if (result.canceled) { e.reply('loadWaveTableByDialogCanceled') }
      
      Utils.readFile(result.filePaths[0]).then((buffer: Buffer) => {
        return WavDecoder.decode(buffer, {});
      }).then((audioData) => {
        e.reply('loadWaveTableByDialogSucseed', { filePath: result.filePaths[0], audioData });
        if (isDev) { console.log(audioData); }
      }).catch((err: any) => {
        e.reply('loadWaveTableByDialogFailed', err);
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
      if (isDev) { console.log('loaded audio data:',audioData) }
    }).catch((err: any) => {
      e.reply('loadWaveTableFailed', err);
    })
  })
  // window.api.loadWaveTable(filePath);
}
