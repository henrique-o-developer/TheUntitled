
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld(
  'windowControls',
  {
    close: () => ipcRenderer.send('windowControls:close'),
    maximize: () => ipcRenderer.send('windowControls:maximize'),
    minimize: () => ipcRenderer.send('windowControls:minimize')
  }
)