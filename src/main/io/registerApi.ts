import path from 'path';
import { ipcMain, dialog } from 'electron';
import { BrowserWindow } from 'electron/main';
import WavDecoder from 'wav-decoder';
import { AxisYType } from '../../renderer/model/Effect';
import * as Utils from './Utils';
import SCSynth from './SCSynth';
import fs from 'fs';

const playerSynthDefFilePath = '../assets/synthDef/player.scd';
const grainDurSynthDefFilePath = '../assets/synthDef/grainDur.scd';
const grainRateSynthDefFilePath = '../assets/synthDef/grainRate.scd';
const recorderSynthDefFilePath = '../assets/synthDef/recorder.scd';
const audioInSynthDefFilePath = '../assets/synthDef/audioIn.scd';
const bufRdSynthDefFilePath = '../assets/synthDef/bufRd.scd';
const optionNumBuffers = '12000';

let scSynth: SCSynth;


// API register
export default async function registerApi(window: BrowserWindow, isDev: boolean): Promise<void> {
  console.log('register events for the api');

  scSynth = new SCSynth({
    numBuffers: optionNumBuffers,
    device: 'Soundflower (2ch)',
  });
  /**
   * Load Store file
   * returns
   * 'loadStoreSucceed'
   */
  ipcMain.on('loadSetting', async (e) => {
    if (isDev) { console.log('loadSetting!! in api'); }
    await scSynth.checkRemoteHealth().then((isHealthy) => {
      if (isHealthy) {
        window.webContents.postMessage('booted', { mode: scSynth.mode });
      }
    });

    e.reply('loadSettingSucceed');
  });

  /**
   * Read Wav file from path
   * returns
   * 'loadWaveTableByDialogCanceled'
   * 'loadWaveTableByDialogSucceed'
   * 'loadWaveTableByDialogFailed'
   */
  ipcMain.on('loadWaveTableByDialog', async (e) => {
    const result = await dialog.showOpenDialog(window, {
      properties: ['openFile', 'openDirectory'],
      filters: [{ name: 'msplr', extensions: ['wav'] }],
    });
    // .then((result) => {
    if (result.canceled) {
      e.reply('loadWaveTableByDialogCanceled');
      return;
    }
    const buffer = await Utils.readFile(result.filePaths[0]);

    const audioData = await WavDecoder.decode(buffer, {});

    const msg = await scSynth.allocReadBuffer(result.filePaths[0], null);
    const arg = { bufnum: msg.value, filePath: result.filePaths[0], data: Utils.reduceAudioData(audioData.channelData[0]) };
    e.reply('loadWaveTableByDialogSucceed', arg);

    if (isDev) { console.log('loaded audio data:', msg, result, audioData); }
  });
  // window.api.openFileDialog();

  /**
   * Read Wav file from path
   * returns
   * 'loadWaveTable'
   * 'loadWaveTableSucceed'
   * 'loadWaveTableFailed'
   */
  ipcMain.on('loadWaveTable', (e, filePath) => {
    Utils.readFile(filePath).then((buffer: Buffer) => {
      return WavDecoder.decode(buffer, {});
    }).then((audioData) => {
      return scSynth.allocReadBuffer(filePath, null)
        .then((msg) => {
          e.reply('loadWaveTableSucceed', { bufnum: msg.value, filePath: filePath, data: Utils.reduceAudioData(audioData.channelData[0]) });
          if (isDev) { console.log('loaded audio data:', Utils.reduceAudioData(audioData.channelData[0])); }
        });
    }).catch((err: any) => {
      e.reply('loadWaveTableFailed', err);
    });
  });
  // window.api.loadWaveTable(filePath);

  /**
   * Playback buffer
   * returns
   * 'playerRequest'
   * 'playerSuccess'
   * 'playerFailure'
   */
  ipcMain.on('playerRequest', (
    e,
    bufnum: number,
    slice: ({ begin: number; end: number } | undefined),
    effect: { amp: number; rate: number; pan: number; gain: number },
  ) => {
    if (isDev) { console.log('play request:', bufnum, slice, effect); }
    try {
      scSynth.playBuffer(bufnum, slice, effect);
    } catch (err) {
      e.reply('playerFailure', err);
    }
    e.reply('playerSuccess', bufnum);
  });
  // window.api.playerSuccess(bufnum);

  /**
   * Playback buffer
   * returns
   * 'playerRequest'
   * 'playerSuccess'
   * 'playerFailure'
   */
  ipcMain.on('grainPlayerRequest', (
    e,
    bufnum: number,
    slice: ({ begin: number; end: number } | undefined),
    effect: { amp: number; rate: number; pan: number; gain: number; points: Array<{ x: number; y: number }>; duration: number; trig: number; axisY: AxisYType },
  ) => {
    if (isDev) { console.log('grain play request:', effect.points.length, bufnum, slice, effect); }
    try {
      scSynth.playGrain(bufnum, slice, effect);
    } catch (err) {
      e.reply('playerFailure', err);
    }
    e.reply('playerSuccess', bufnum);
  });

  /**
   * allocBufferRequest
   * allocBufferSucceed
   * allocBufferFailed
   */
  ipcMain.on('allocBufferRequest', (e, bufnum, filePath) => {
    if (isDev) { console.log('allocBufferRequest', e, bufnum, filePath); }
    scSynth.allocReadBuffer(filePath, bufnum).then(() => {
      e.reply('allocBufferSucceed', { bufnum: bufnum, filePath: filePath });
    }).catch((err: any) => {
      e.reply('allocBufferFailed', err);
    });
  });

  /**
   * save store as file
   */
  ipcMain.on('saveStore', (e) => {
    window.webContents
      .executeJavaScript('localStorage.getItem("persist:root");', true)
      .then((data) => {
        dialog.showSaveDialog({
          filters: [{ name: 'WaveTable', extensions: ['msplr'] }],
        }).then((result) => {
          if (result.filePath) {
            const finalJson = data.replace(/\\"/g, '"').replace(/"{/g, '{').replace(/}"/g, '}');
            fs.writeFile(result.filePath, finalJson, {}, (err) => {
              e.reply('saveStoreFailed', err);
            });
          }
        }).catch((err) => {
          e.reply('saveStoreFailed', err);
        });
      });
  });
  /**
   * open store as file
   */
  ipcMain.on('openStore', (e) => {
    dialog.showOpenDialog(window, {
      properties: ['openFile', 'openDirectory'],
      filters: [{ name: 'Msplr', extensions: ['msplr'] }],
    }).then((result) => {
      if (result.canceled) {
        e.reply('openStoreCanceled');
        return;
      }
      Utils.restoreData(result.filePaths[0]).then((restoreData: any) => {
        e.reply('openStoreSucceed', { restoreData: restoreData });
      }).catch((err: any) => {
        e.reply('openStoreFailed', err);
      });
    });
  });

  /**
   * after set apis then boot server and lang.
   */
  scSynth.subscribe('/midi', async (msg) => {
    const channel = parseInt(msg![0] as string, 10);
    window.webContents.send('onMIDIReceive', { channel: channel });
  });
  await scSynth.boot().then(() => {
    window.webContents.postMessage('booted', { mode: scSynth.mode });
  });

  if (scSynth.mode === 'internal') {
    await scSynth.loadSynthDefFromFile('player', path.resolve(__dirname, playerSynthDefFilePath));
    await scSynth.loadSynthDefFromFile('grainDur', path.resolve(__dirname, grainDurSynthDefFilePath));
    await scSynth.loadSynthDefFromFile('grainRate', path.resolve(__dirname, grainRateSynthDefFilePath));
    await scSynth.loadSynthDefFromFile('bufRd', path.resolve(__dirname, bufRdSynthDefFilePath));
    await scSynth.loadSynthDefFromFile('recorder', path.resolve(__dirname, recorderSynthDefFilePath));
    await scSynth.loadSynthDefFromFile('audioIn', path.resolve(__dirname, audioInSynthDefFilePath));
  } else {
    const path_ = path.resolve(__dirname, '../assets/synthDef');
    await scSynth.loadSynthDefFromSynthDef(path_);
  }
}

export async function quitSC() {
  return Promise.all([scSynth.quit()]);
}
