import path from 'path';
import { BrowserWindow, app, systemPreferences, dialog } from 'electron';
// import loadDevtool from 'electron-load-devtool';
import registerApi, { quitSC } from './io/registerApi';
import fs from 'fs';
import fsExtra from 'fs-extra';

const isDev = process.env.NODE_ENV === 'development';

const execPath =
  process.platform === 'win32'
    ? '../../node_modules/electron/dist/electron.exe'
    : '../../node_modules/.bin/electron';

// hot reload elecron
// if (isDev) {
//   require('electron-reload')(__dirname + 'index.js', {
//     electron: path.resolve(__dirname, execPath),
//     forceHardReset: true,
//     hardResetMethod: 'exit',
//   });
// }

async function askForMediaAccess(): Promise<boolean> {
  try {
    if (process.platform !== 'darwin') {
      return true;
    }

    const status = await systemPreferences.getMediaAccessStatus('microphone');
    console.log('Current microphone access status:', status);

    if (status === 'not-determined') {
      const success = await systemPreferences.askForMediaAccess('microphone');
      console.log('Result of microphone access:', success.valueOf() ? 'granted' : 'denied');
      return success.valueOf();
    }

    return status === 'granted';
  } catch (error) {
    console.error('Could not get microphone permission:', error);
  }
  return false;
}

askForMediaAccess().then((isGranted) => {
  if (!isGranted) {
    dialog.showErrorBox('Warning', 'Please Microphone Access to be Granted.');
  }
}).catch((err) => console.error(err));

// make BrowserWindow
const createWindow = () => {
  const mainWindow = new BrowserWindow({
    frame: false, // frameless
    backgroundColor: '#000',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      backgroundThrottling: false,
      preload: path.resolve(__dirname, './preload.js'),
    },
    width: 500,
    height: 450,
  });

  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: 'detach' }); // open devtool
  }

  const resourcePath = process.env.ENV === 'production' ? process.resourcesPath : __dirname;
  fs.access(path.join(resourcePath, '../sounds'), fs.constants.F_OK, (error) => {
    if (error) {
      if (error.code === 'ENOENT') {
        fs.mkdir(path.join(resourcePath, '../sounds'), (e) => {
          console.error('Failed to mkdir /sounds', e);
        });
      }
    }
  });

  registerApi(mainWindow, resourcePath, isDev);

  // load app
  // let url = isDev ? path.join(__dirname, '../index.html') : path.join(__dirname, '../renderer/index.html');
  // console.log('LOAD URL,', url);
  // mainWindow.loadFile(url);
  process.env.ENV === 'production' ? mainWindow.loadFile(path.join(__dirname, '../index.html')) : mainWindow.loadURL(`http://localhost:${process.env.PORT}`);
};

app.whenReady().then(async () => {
  createWindow();
});

fsExtra.emptyDirSync(app.getPath('userData'));

// when close window
app.once('window-all-closed', async () => {
  await quitSC();
  if (process.platform !== 'darwin') {
    app.quit();
  }
  // app.quit()
});
