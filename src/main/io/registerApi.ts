import { ipcMain } from 'electron';
import { BrowserWindow } from 'electron/main';
import { dialog } from 'electron';
import WavDecoder, { AudioData } from 'wav-decoder';
import TableList from '../../renderer/model/TableList';
import * as Utils from './Utils';
import SCSynth from './SCSynth';
import SCLang from './SCLang';

const playerStnthDefFilePath = __dirname + "./'\/../../../media/synthDef/player.scd";
const recorderStnthDefFilePath = __dirname + "./'\/../../../media/synthDef/recorder.scd";
const audioInStnthDefFilePath = __dirname + "./'\/../../../media/synthDef/audioIn.scd";
const optionNumBuffers = '12000';

let scSynth: SCSynth;
let scLang: SCLang;

// API register
export default async function registerApi(window: BrowserWindow, isDev: boolean): Promise<void> {
  console.log('register events for the api');
  
  scSynth = new SCSynth({
    numBuffers: optionNumBuffers
  });
  scLang = new SCLang();
  /**
   * Load Store file
   * returns
   * 'loadStoreSucseed'
   * 'loadStoreFailed'
   */
  ipcMain.on('loadSetting', async (e) => {
    if (isDev) { console.log('loadSetting!! in api'); }
    await scSynth.checkRemoteHealth().then(isHealthy => {
      if (isHealthy) {
        window.webContents.postMessage('booted', { mode: scSynth.mode });
      } else { }
    });

    e.reply('loadSettingSucseed');
    
    // Utils.loadStore().then((tables: TableList) => {
    //   e.reply('loadSettingSucseed', tables);
    // }).catch((err: any) => {      
    //   e.reply('loadSettingFailed', err);
    // })
    // e.reply('loadSettingFailed', new Error('not implimented yet.'));
  });
  // window.api.loadStore();

  /**
   * Read Wav file from path
   * returns
   * 'loadWaveTableByDialogCanceled'
   * 'loadWaveTableByDialogSucseed'
   * 'loadWaveTableByDialogFailed'
   */
  ipcMain.on('loadWaveTableByDialog', (e) => {
    dialog.showOpenDialog(window, {
      properties: ["openFile", 'openDirectory'],
      filters: [{ name: "msplr", extensions: ["wav"] }]
    },
    ).then((result) => {
      if (result.canceled) { e.reply('loadWaveTableByDialogCanceled') }
      
      Utils.readFile(result.filePaths[0]).then((buffer: Buffer) => {
        return WavDecoder.decode(buffer, {});
      }).then((audioData) => {
        return scSynth.allocReadBuffer(result.filePaths[0], null)
          .then((msg) => {
            e.reply('loadWaveTableByDialogSucseed', { bufnum: msg.value, filePath: result.filePaths[0], data: Utils.reduceAudioData(audioData.channelData[0]) });
          if (isDev) { console.log('loaded audio data:', audioData) }
          })
      }).catch((err: any) => {
        e.reply('loadWaveTableByDialogFailed', err);
      })
    })
  });
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
      return scSynth.allocReadBuffer(filePath, null)
        .then((msg) => {
          e.reply('loadWaveTableSucseed', { bufnum: msg.value, filePath: filePath, data: Utils.reduceAudioData(audioData.channelData[0]) });
          if (isDev) { console.log('loaded audio data:', Utils.reduceAudioData(audioData.channelData[0])); }
        });
    }).catch((err: any) => {
      e.reply('loadWaveTableFailed', err);
    })
  });
  // window.api.loadWaveTable(filePath);

  /**
   * Playback buffer
   * returns
   * 'playerRequest'
   * 'playerSuccess'
   * 'playerFailure'
   */
  ipcMain.on('playerRequest', (e, bufnum) => {
    if (isDev) { console.log('playerRequest', e, bufnum) }
    try {
      scSynth.playBuffer(bufnum);
    } catch (err) {
      e.reply('playerFailure', err);
    }
    e.reply('playerSuccess', bufnum);
  });
  // window.api.playerSuccess(bufnum);

  /**
   * allocBufferRequest
   * allocBufferSucseed
   * allocBufferFailed
   */
  ipcMain.on('allocBufferRequest', (e, bufnum, filePath) => {
    if (isDev) { console.log('allocBufferRequest', e, bufnum, filePath) }
    scSynth.allocReadBuffer(filePath, bufnum).then((msg) => {
      e.reply('allocBufferSucseed', { bufnum: bufnum, filePath: filePath });
    }).catch((err: any) => {
      e.reply('allocBufferFailed', err);
    });
  });
  // window.api.allocBuffer(bufnum);

  /**
   * after set apis then boot server and lang.
   */
  await scSynth.boot().then((e) => {
    window.webContents.postMessage('booted', { mode: scSynth.mode });
  });
  
  await scLang.boot();
  if (scSynth.mode === 'internal') {
    await scSynth.loadSynthDefFromFile('player', playerStnthDefFilePath);
    await scSynth.loadSynthDefFromFile('recorder', recorderStnthDefFilePath);
    await scSynth.loadSynthDefFromFile('audioIn', audioInStnthDefFilePath);
  } else {
    await scLang.loadSynthDefs();
  };
};