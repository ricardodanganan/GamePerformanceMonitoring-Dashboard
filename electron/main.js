const { app, BrowserWindow } = require("electron");
const path = require("path");

let overlayWindow;

app.whenReady().then(() => {
  overlayWindow = new BrowserWindow({
    width: 200,
    height: 100,
    frame: false,
    alwaysOnTop: true, // Stay on top of all windows
    transparent: true, // Transparent background
    skipTaskbar: true, // Hide from taskbar
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
    },
  });

  overlayWindow.setIgnoreMouseEvents(true); // Allow mouse clicks to pass through
  overlayWindow.loadFile("overlay.html"); // Load FPS overlay

  // Ensure Electron remains running in the background
  app.on("window-all-closed", (e) => {
    e.preventDefault();
  });
});
