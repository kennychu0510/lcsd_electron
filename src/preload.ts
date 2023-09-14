// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';

export const ElectronAPI = {
  onEnquire: () => ipcRenderer.send('go-to-enquire-page'),
  onCloseBrowser: () => ipcRenderer.send('close-browser'),
  handlePlaywrightStatus: (setStatus: (status: string) => void) =>
    ipcRenderer.on('playwright-update', (event, value) => {
      setStatus(value);
    }),
};

contextBridge.exposeInMainWorld('ElectronAPI', ElectronAPI);
