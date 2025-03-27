const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  detectImage: (path) => ipcRenderer.invoke('detect-image', path),
  onPythonOutput: (callback) => ipcRenderer.on('python-process-output', callback)
})
