import { ipcMain } from 'electron';

// API register
export function registerApi(isDev: boolean): void {
  ipcMain.on('nyan', (e, arg) => {
    if (isDev) { console.log(arg) };
    e.reply('nyan', 'pong!');
  });

}
