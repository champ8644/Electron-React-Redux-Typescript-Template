import { dialog } from 'electron';

import Bridge from '../bridge';

export async function excelImport() {
  try {
    const userChosenPath = await dialog.showOpenDialog({
      title: 'Choose Excel file',
      message: 'Select the student database',
      properties: ['openFile'],
      filters: [{ name: 'Excel Files', extensions: ['xlsx'] }]
    });
    if (userChosenPath.canceled) return;
    const filePath = userChosenPath.filePaths[0];
    Bridge.call.toastLog(filePath);
  } catch (error: any) {
    Bridge.call.toastError(error);
  }
}

// export function onDownloadMultiple(payload, getSummary) {
//   return async (dispatch, getState) => {
//     const state = getState();
//     // var toLocalPath = path.resolve(app.getPath('desktop'));
//     const userChosenPath = await dialog.showOpenDialog({
//       title: 'Choose Destination',
//       properties: ['openDirectory']
//     });
//     if (userChosenPath.canceled) return;
//     const [setProgress, isToastValid] = toast.progress(
//       `Downloading ${payload.id.length} files`,
//       () => {}
//     );
//     let progressCount = 0;
//     const addProgress = (add) => {
//       progressCount += add;
//       setProgress(progressCount);
//     };
//     const summaryOutput = [];
//     for (const id of payload.id) {
//       if (!isToastValid()) return;
//       const summary = await onDownloadDataCenter({
//         id,
//         state,
//         folderPath: userChosenPath.filePaths[0]
//       });
//       summaryOutput.push(summary);
//       addProgress(100 / payload.id.length);
//     }
//     addProgress(100);
//     if (getSummary) {
//       console.log('🚀 ~ file: dataCenter.js ~ line 121 ~ return ~ summaryOutput', summaryOutput);
//       writeBook(path.join(userChosenPath.filePaths[0], 'summary.xlsx'), summaryOutput);
//     }
//     return dispatch({
//       type: ON_DOWNLOAD_DATACENTER,
//       payload
//     });
//   };
// }
// export function onGenerateFile(row) {
//   return async () => {
//     // var toLocalPath = path.resolve(app.getPath('desktop'));
//     const userChosenPath = await dialog.showSaveDialog({
//       title: 'Save As',
//       defaultPath: `${row.hn}.xlsx`,
//       properties: ['saveFile'],
//       filters: [{ name: 'Excel Files', extensions: ['xls', 'xlsx'] }]
//     });
//     if (userChosenPath.canceled) return;
//     const header = [
//       'Time',
//       format(subDays(new Date(), 1), 'd/M/yyyy'),
//       format(new Date(), 'd/M/yyyy')
//     ];
//     const cols = [5, ...Array.from(Array(header.length - 1)).map(() => 10)];
//     const obj = [];
//     for (let i = 6; i <= 24; i++) {
//       obj.push({ Time: `${i}:00` });
//     }
//     try {
//       writeBook(userChosenPath.filePath, obj, { header, cols });
//       toast.success(
//         `Generated ${basename(userChosenPath.filePath)}`
//         // , null, {
//         //   onClick: () => {
//         //     shell.showItemInFolder(userChosenPath.filePath);
//         //     console.log('Hello');
//         //   }
//         // }
//       );
//       shell.showItemInFolder(userChosenPath.filePath);
//     } catch (err) {
//       toast.error(err.message);
//     }
//   };
// }
