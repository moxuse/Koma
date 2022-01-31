import path from 'path';
import { ipcMain } from 'electron';
import { BrowserWindow } from 'electron/main';
import { dialog } from 'electron';
import WavDecoder from 'wav-decoder';
import * as Utils from './Utils';
import SCSynth from './SCSynth';
// import SCLang from './SCLang';
import fs from 'fs';

const playerSynthDefFilePath = __dirname + "\/../../synthDef/player.scd";
const grainPlayerSynthDefFilePath = __dirname + "\/../../synthDef/grainPlayer.scd";
const recorderSynthDefFilePath = __dirname + "\/../../synthDef/recorder.scd";
const audioInSynthDefFilePath = __dirname + "\/../../synthDef/audioIn.scd";
const bufRdSynthDefFilePath = __dirname + "\/../../synthDef/bufRd.scd";
const optionNumBuffers = '12000';

let scSynth: SCSynth;
// let scLang: SCLang;

// API register
export default async function registerApi(window: BrowserWindow, isDev: boolean): Promise<void> {
  console.log('register events for the api');
  
  scSynth = new SCSynth({
    numBuffers: optionNumBuffers,
    // device: 'Soundflower (2ch)'
  });
  // scLang = new SCLang();
  /**
   * Load Store file
   * returns
   * 'loadStoreSucseed'
   */
  ipcMain.on('loadSetting', async (e) => {
    if (isDev) { console.log('loadSetting!! in api'); }
    await scSynth.checkRemoteHealth().then(isHealthy => {
      if (isHealthy) {
        window.webContents.postMessage('booted', { mode: scSynth.mode });
      } else { }
    });

    e.reply('loadSettingSucseed');
  });

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
  ipcMain.on('playerRequest', (
    e,
    bufnum: number,
    slice: ({ begin: number, end: number } | undefined),
    effect: { rate: number, pan: number, gain: number }
    ) => {
    if (isDev) { console.log('play request:', bufnum, slice, effect) }
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
    slice: ({ begin: number, end: number } | undefined),
    effect: { rate: number, pan: number, gain: number, points: Array<{x: number, y: number}>, duration: number, trig: number }
    ) => {
    if (isDev) { console.log('grain play request:', effect.points.length, bufnum, slice, effect) }
     try {
      scSynth.playGrain(bufnum, slice, effect);
    } catch (err) {
      e.reply('playerFailure', err);
    }
    e.reply('playerSuccess', bufnum);
  });

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

  /**
   * save store as file
   */
  ipcMain.on('saveStore', (e) => {    
    window.webContents
    .executeJavaScript('localStorage.getItem("persist:root");', true)
    .then(data => {
      dialog.showSaveDialog({
        filters: [{ name: "WaveTable", extensions: ["msplr"] }]
      }).then((result) => {
        if (result.filePath) {
          const finalJson = data.replace(/\\"/g, '"').replace(/"{/g, '{').replace(/}"/g, '}');
          fs.writeFile(result.filePath, finalJson, {}, err => {
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
      properties: ["openFile", 'openDirectory'],
      filters: [{ name: "Msplr", extensions: ["msplr"] }]
    }).then((result) => {
      if (result.canceled) { e.reply('openStoreCanceled') }
      Utils.restoreData(result.filePaths[0]).then((restoerData: any) => {
        e.reply('openStoreSucseed', { restoerData });
      }).catch((err: any) => {
        e.reply('openStoreFailed', err);
      })
    })
  });
  /**
   * assign MIDI api
   */
  ipcMain.on('midiAssignRequest', (e, data) => {
    // scLang.assignMidi(0, data) // args: channelOffset, data
    //   .then((msg) => {
    //     e.reply('midiAssignSucseed', {});
    //     if (isDev) { console.log('Assign MIDI:', data) }
    //   }).catch((err: any) => {
    //     e.reply('midiAssignFailed', err);
    //   });
  });
  /**
   * after set apis then boot server and lang.
   */
  scSynth.subscribe('/midi', async (msg) => { 
     const channel = parseInt(msg![0] as string);
     window.webContents.send("onMIDIRecieve", { channel });
  })
  await scSynth.boot().then((e) => {
    window.webContents.postMessage('booted', { mode: scSynth.mode });
  });
  
  // await scLang.boot().catch((err: Error) => {
  //   console.log(err);
  // });
  if (scSynth.mode === 'internal') {
    await scSynth.loadSynthDefFromFile('player', playerSynthDefFilePath);
    await scSynth.loadSynthDefFromFile('grainPlayer', grainPlayerSynthDefFilePath);
    await scSynth.loadSynthDefFromFile('bufRd', bufRdSynthDefFilePath);
    await scSynth.loadSynthDefFromFile('recorder', recorderSynthDefFilePath);
    await scSynth.loadSynthDefFromFile('audioIn', audioInSynthDefFilePath);
  } else {
    // await scLang.loadSynthDefs();
  };
  // await scLang.connectMIDI();
};

export async function quitSC() { 
  return Promise.all([scSynth.quit()]);
}
