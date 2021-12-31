import AppToaster from '../scripts/AppToaster';

export * from './UpdaterFunctions';

export function toastError(message: string) {
  AppToaster.error(message);
}

export function toastLog(message: string) {
  AppToaster.log(message);
}

export function consoleLog(message: any) {
  console.log(message);
}
