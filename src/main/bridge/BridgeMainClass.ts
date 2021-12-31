import Electron from 'electron';
import _ from 'lodash';

import { APIs, MainFunctions, RendererAPIs, RendererKeysNullObj } from './APIs';

export default class BridgeMainClass {
  call: APIs;
  ipcMain: Electron.IpcMain;
  ipcRenderer: Electron.IpcRenderer;
  webContents: Electron.WebContents | undefined;
  type = 'main';

  constructor({
    ipcMain,
    ipcRenderer
  }: {
    ipcMain: Electron.IpcMain;
    ipcRenderer: Electron.IpcRenderer;
  }) {
    this.ipcMain = ipcMain;
    this.ipcRenderer = ipcRenderer;
    const RendererCalls = _.fromPairs(
      _.keys(RendererKeysNullObj).map((RendererKey) => [
        RendererKey,
        (...args: any[]) => {
          if (!this.webContents)
            throw new Error('Bridge Main Class (Register Window) Not initialized');
          return this.webContents.send(RendererKey, ...args);
        }
      ])
    ) as RendererAPIs;
    this.call = {
      ...MainFunctions,
      ...RendererCalls
    } as APIs;
    this.registerIPCMain();
  }

  sendInitialData() {
    const { NODE_ENV } = process.env;
    this.webContents?.on('dom-ready', () => {
      this.webContents?.send('process-env', { NODE_ENV });
    });
  }

  registerWindow(mainWindow: Electron.BrowserWindow) {
    this.webContents = mainWindow.webContents;
    require('@electron/remote/main').enable(this.webContents);
    this.sendInitialData();
  }

  registerIPCMain() {
    _.forEach(MainFunctions, (method, methodName) => {
      this.ipcMain.handle(methodName, async (e, ...args) =>
        (method as any).apply(null, args as any)
      );
    });
  }

  //   exposeIPCRenderer(): MainAPIs {
  //     return _.fromPairs(
  //       MainKeys.map((MainKey) => [MainKey, (...args) => this.ipcRenderer.invoke(MainKey, ...args)])
  //     ) as MainAPIs;
  //   }
}
