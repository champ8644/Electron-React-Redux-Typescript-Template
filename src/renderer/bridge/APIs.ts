import * as _RendererFunctions from './RendererFunctions';

import type { MainAPIs as _MainAPIs } from '../../main/bridge/APIs';

export type MainAPIs = _MainAPIs;
export type APIs = MainAPIs & RendererAPIs;

export const MainKeysNullObj: { [k in keyof MainAPIs]: null } = {
  excelImport: null
};

export const RendererFunctions = _RendererFunctions;
export type RendererAPIs = typeof RendererFunctions;
export const RendererKeys = Object.keys(RendererFunctions) as Array<keyof typeof RendererFunctions>;
