import AppToaster, { ProgressToaster } from '../scripts/AppToaster';

let progressToaster: ProgressToaster | undefined;

const verbose = true;

/**
 * Called when AppUpdater is error
 * @param error an error obj from App Updater
 */
export function errorUpdate(error: string): void {
  verbose && console.log('errorUpdate');
  if (progressToaster) progressToaster.error(error);
  else AppToaster.error(error);
}

/**
 * Called when the AppUpdater initiates checking
 */
export function checkingForUpdate(): void {
  verbose && console.log('checkingForUpdate');
}

type UpdateStatus = {
  version: string;
  releaseName: string;
  releaseNotes: string;
};
/**
 * Called when an update is found and avaliable
 * @param status status of update (version, releases, etc...)
 */
export function updateAvailable(status: UpdateStatus): void {
  verbose && console.log('updateAvailable');
  progressToaster = AppToaster.progress(`Downloading v.${status.version}`);
}

/**
 * Called when an update is not avaliable, maybe it's already latest
 */
export function updateNotAvailable(): void {
  verbose && console.log('updateNotAvailable');
}

type DownloadStatus = {
  total: number;
  delta: number;
  transferred: number;
  percent: number;
  bytesPerSecond: number;
};
/**
 * Called when the updater is currently downloading
 * @param status Downloading status
 */
export function downloadProgress(status: DownloadStatus): void {
  verbose && console.log('downloadProgress');
  progressToaster?.set(status.percent);
}

/**
 * Called when an update download is completed
 */
export function updateDownloaded(): void {
  verbose && console.log('updateDownloaded');
  progressToaster?.set(100);
}
