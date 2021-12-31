import { app, BrowserWindow } from 'electron';
import path from 'path';

import Bridge from './bridge';
import MenuBuilder from './menu';
import DevtoolsModule from './module/DevtoolsModule';
import * as ModulesManager from './module/modules-manager';
import AppUpdater from './updater';

require('@electron/remote/main').initialize();

try {
  // if (process.env.NODE_ENV === 'development')
  require('electron-reloader')(module);
} catch {}

const seticons =
  process.platform === 'linux'
    ? '../../../assets/icons/linux/icon.png'
    : '../../../assets/icons/win/icon.ico';

let _appUpdater: AppUpdater | undefined;

/**
 * creates a new browser window with a preload script and loads index.html file into this window
 * @returns {void}
 */
function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    icon: path.join(__dirname, seticons),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, '../../../dist/index.html'));

  // Open the DevTools
  if (process.env.NODE_ENV === 'development') mainWindow.webContents.openDevTools();

  const menuBuilder = new MenuBuilder(mainWindow);
  mainWindow.setMenu(menuBuilder.buildMenu());

  // Remove this if your app does not use auto updates
  if (!_appUpdater) {
    _appUpdater = new AppUpdater(mainWindow);
  }
  return mainWindow;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  const mainWindow = createWindow();
  Bridge.registerWindow(mainWindow);

  ModulesManager.init(new DevtoolsModule(mainWindow)).catch(console.error);

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
