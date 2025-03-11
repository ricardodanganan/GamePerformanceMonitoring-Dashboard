// ✅ Create the FPS Overlay Window in Electron (main.js)
// The FPS Overlay window will display the current frames per second (FPS) of the Electron app. 
// This is useful for debugging performance issues in your Electron app.

const { app, BrowserWindow, ipcMain, screen } = require("electron");
const path = require("path");

let overlayWindow;
let dashboardWindow;

app.whenReady().then(() => {
  // ✅ Create the FPS Overlay Window
  overlayWindow = new BrowserWindow({
    width: 300, // Increased width for more metrics
    height: 100, // Increased height for CPU/GPU data
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    skipTaskbar: true,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    },
  });
  

  overlayWindow.setIgnoreMouseEvents(true);
  overlayWindow.loadFile(path.join(__dirname, "overlay.html"));

  // ✅ Position FPS Counter at Upper-Right Corner
  const { width } = screen.getPrimaryDisplay().bounds;
  overlayWindow.setBounds({ x: width - 310, y: 10, width: 300, height: 100 });

  // ✅ Create the React Dashboard Window (New)
  dashboardWindow = new BrowserWindow({
    width: 1400, // Adjust size as needed
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // ✅ Use the same preload
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    },
  });

  // ✅ Load the React App in Electron Instead of Chrome
  dashboardWindow.loadURL("http://localhost:5173");

  // ✅ Fix: Toggle FPS Overlay from React
  ipcMain.on("toggle-fps", () => {
    if (overlayWindow) {
      if (overlayWindow.isVisible()) {
        overlayWindow.hide();
        console.log("FPS Overlay Hidden");
      } else {
        overlayWindow.show();
        console.log("FPS Overlay Shown");
      }
    }
  });

    // ✅ Listen for system metrics from Dashboard.jsx and forward to the FPS overlay
    ipcMain.on("update-overlay", (event, data) => {
        if (overlayWindow) {
            overlayWindow.webContents.send("update-overlay-stats", data);
        }
    });

  app.on("window-all-closed", (e) => {
    e.preventDefault();
  });
});
