import path from 'path';
import { BrowserWindow, app, ipcMain, session } from 'electron';
import registerApi from './io/registerApi';
// import './view/preload';

const isDev = process.env.NODE_ENV === 'development';

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
    backgroundColor: '#2e2c2c',
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
});

// when close window
app.once('window-all-closed', () => app.quit());
