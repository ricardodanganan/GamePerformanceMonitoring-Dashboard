const { contextBridge, ipcRenderer } = require("electron");

// ✅ Properly expose Electron API to the frontend
contextBridge.exposeInMainWorld("electron", {
  send: (channel, data) => {
    ipcRenderer.send(channel, data);
  },
  receive: (channel, callback) => {
    ipcRenderer.on(channel, (event, ...args) => callback(...args));
  },
  isElectron: true, // ✅ Allows React to check if Electron is available
});
