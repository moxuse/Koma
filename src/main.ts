import path from 'path';
import { BrowserWindow, app, session } from 'electron';

const isDev = process.env.NODE_ENV === 'development';

const execPath =
  process.platform === 'win32'
    ? '../node_modules/electron/dist/electron.exe'
    : '../node_modules/.bin/electron';

// 開発モードの場合はホットリロードする
if (isDev) {
  require('electron-reload')(__dirname, {
    electron: path.resolve(__dirname, execPath),
    forceHardReset: true,
    hardResetMethod: 'exit',
  });
}

// make BrowserWindow
const createWindow = () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.resolve(__dirname, 'settings.js'),
    },
  });

  if (isDev) {
    // devの場合はデベロッパーツールを開く
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  // load app
  mainWindow.loadFile('index.html');
};

app.whenReady().then(async () => {
  // if (isDev) { }
  createWindow();
});

// when close window
app.once('window-all-closed', () => app.quit());
