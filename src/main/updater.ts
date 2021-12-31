import { BrowserWindow, ipcMain } from 'electron';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';

export default class AppUpdater {
  window: BrowserWindow;
  status: string;
  payload: Record<string, any> | undefined;

  constructor(window: BrowserWindow) {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    this.window = window;
    this.status = 'waiting';
    ipcMain.handle('checkForAvaliableUpdate', () => ({
      status: this.status,
      payload: this.payload
    }));
    ipcMain.on('quitAndInstall', () => {
      if (this.status === 'updateDownloaded') autoUpdater.quitAndInstall(true, true);
    });
    autoUpdater.on('error-update', (err) => {
      log.error('error', err);
      const { code, message } = err;
      log.error(JSON.stringify({ code, message }, null, 2));
      this.sendStatusToWindow('errorUpdate', err);
    });
    autoUpdater.on('checking-for-update', () => this.sendStatusToWindow('checkingForUpdate'));
    autoUpdater.on('update-available', (info) =>
      this.sendStatusToWindow('updateAvailable', {
        version: info.version,
        releaseName: info.releaseName,
        releaseNotes: info.releaseNotes
      })
    );
    autoUpdater.on('update-not-available', () => this.sendStatusToWindow('updateNotAvailable'));
    autoUpdater.on('download-progress', (progressObj) =>
      this.sendStatusToWindow('downloadProgress', {
        total: progressObj.total,
        delta: progressObj.delta,
        transferred: progressObj.transferred,
        percent: progressObj.percent,
        bytesPerSecond: progressObj.bytesPerSecond
      })
    );
    autoUpdater.on('update-downloaded', () => {
      this.sendStatusToWindow('updateDownloaded');
      autoUpdater.quitAndInstall(true, true);
    });
    this.checkForUpdatesAndNotify();
  }

  async checkForUpdatesAndNotify() {
    let res;
    // Add try/catch condition here because checkForUpdatesAndNotify will throw
    // when it encounters 404 errors.
    try {
      res = await autoUpdater.checkForUpdatesAndNotify();
      log.info('checkForUpdatesAndNotify');
      log.info(res);
    } catch (e) {}
    // If no updates are received, send status to window
    if (!res) {
      this.sendStatusToWindow('updateNotAvailable');
    }
    // setInterval(() => {
    //   this.sendStatusToWindow(
    //     'update-not-available',
    //     JSON.stringify({
    //       res
    //     })
    //   );
    // }, 1000);
  }

  sendStatusToWindow(text: string, payload?: Record<string, any>) {
    log.info(text);
    log.info(JSON.stringify(payload));
    this.window.webContents.send(text, payload);
    this.status = text;
    this.payload = payload;
    // switch (text) {
    //   case 'checking-for-update':
    //   case 'update-available':
    //   case 'update-not-available':
    //   case 'update-downloaded':
    //     this.window.webContents.send(text, text);
    //     break;
    //   case 'download-progress':
    //     this.window.webContents.send(text, payload);
    //     break;
    //   default:
    // }
  }
}
