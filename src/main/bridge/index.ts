import { ipcMain, ipcRenderer } from 'electron';

import BridgeMainClass from './BridgeMainClass';

const Bridge = new BridgeMainClass({ ipcMain, ipcRenderer });

export default Bridge;
