// This file is loaded into the renderer process before any other JavaScript
// is loaded. It's a great place to expose Node.js modules directly to the
// renderer process and do some setup work, like setting up a communication channel between the renderer and main processes.

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
