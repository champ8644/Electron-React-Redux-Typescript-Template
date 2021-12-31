import * as _MainFunctions from './MainFunctions';

import type { RendererAPIs as _RendererAPIs } from '../../renderer/bridge/APIs';

export type RendererAPIs = _RendererAPIs;
export type MainAPIs = typeof MainFunctions;
export type APIs = MainAPIs & RendererAPIs;

export const MainFunctions = _MainFunctions;

export const RendererKeysNullObj: { [k in keyof RendererAPIs]: null } = {
  consoleLog: null,
  toastLog: null,
  toastError: null,
  checkingForUpdate: null,
  downloadProgress: null,
  errorUpdate: null,
  updateAvailable: null,
  updateDownloaded: null,
  updateNotAvailable: null
};

export const MainKeys = Object.keys(MainFunctions) as Array<keyof typeof MainFunctions>;
