const electron = window.require('electron');
const remote = window.require('@electron/remote');

export default {
  ...electron,
  remote: { ...remote, dialog: remote.dialog }
};
