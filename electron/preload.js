// This file is loaded into the renderer process before any other JavaScript
// is loaded. It's a great place to expose Node.js modules directly to the frontend.
// This is useful for exposing Electron APIs to the frontend without exposing the
// entire `ipcRenderer` object. This is also a great place to expose custom APIs
// that you create in the main process.

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
