import path from 'path';
import { BrowserWindow, app, ipcMain, session } from 'electron';
import loadDevtool from 'electron-load-devtool';
import registerApi from './io/registerApi';
const fsExtra = require('fs-extra');
const os = require('os');

const isDev = process.env.NODE_ENV === 'development';

// debugger load
const reactDevToolsPath = path.join(
  os.homedir(),
  '/Library/Application\ Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/4.21.0_0'
)
const reduxDevToolsPath = path.join(
  os.homedir(),
  '/Library/Application\ Support/Google/Chrome/Default/Extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/2.17.2_0'
)

const execPath =
  process.platform === 'win32'
    ? '../node_modules/electron/dist/electron.exe'
    : '../node_modules/.bin/electron';

// hot reload elecron
if (isDev) {
  require('electron-reload')(__dirname + 'dist', {
    electron: path.resolve(__dirname, execPath),
    forceHardReset: true,
    hardResetMethod: 'exit',
  });
}

// make BrowserWindow
const createWindow = () => {
  const mainWindow = new BrowserWindow({
    frame: false, // frameless
    backgroundColor: '#2c2c2c',
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.resolve(__dirname, 'preload.js'),
    },
  });

  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: 'detach' }); // open devtool
  }
  
  registerApi(mainWindow, isDev);

  // load app
  mainWindow.loadFile('index.html');
};

app.whenReady().then(async () => {
  // if (isDev) { }
  createWindow();
  if (isDev) {
    await session.defaultSession.loadExtension(reactDevToolsPath);
    // await session.defaultSession.loadExtension(reduxDevToolsPath);
  }
});

fsExtra.emptyDirSync(app.getPath('userData'));

// when close window
app.once('window-all-closed', () => app.quit());
