import _ from 'lodash';

import { APIs, MainAPIs, MainKeysNullObj, RendererFunctions, RendererKeys } from './APIs';
import Electron from './electron';
import { ErrorHandler } from './ErrorHandler';

const { remote } = Electron;

export default class BridgeRendererClass {
  call: APIs | undefined;
  type = 'renderer';
  env: Record<string, any> = { NODE_ENV: remote.process.env.NODE_ENV };

  constructor() {
    const mainCalls = _.fromPairs(
      _.keys(MainKeysNullObj).map((MainKey) => [
        MainKey,
        (...args: any[]) => {
          console.log('Calling to main', { MainKey, args });
          return Electron.ipcRenderer.invoke(MainKey, ...args);
        }
      ])
    ) as MainAPIs;

    this.call = { ...mainCalls, ...RendererFunctions } as APIs;

    Electron.ipcRenderer.on('process-env', (e, env) => {
      this.env = env;
    });

    RendererKeys.forEach((RendererKey) => {
      Electron.ipcRenderer.on(RendererKey, (e: any, ...args: any[]) => {
        console.log('Send from main', { RendererKey, args });
        return (RendererFunctions[RendererKey] as Function).apply(this, args as any);
      });
    });
  }

  isDEV() {
    if (!this.env) ErrorHandler('isDEV is called before recived process env');
    return this.env.NODE_ENV === 'development';
  }
}
