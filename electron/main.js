// Create the FPS Overlay Window in Electron (main.js) 
// The FPS overlay window will display the current frames per second (FPS) of your application. 
// Game library window will be created when the user clicks on the "Open Game Library" button in the dashboard window.
// run "npm run build" at frontend route/folder whenever changes are made to the frontend code, to update the game library window.

const { app, BrowserWindow, ipcMain, screen } = require("electron");
const path = require("path");

let overlayWindow;
let dashboardWindow;
let libraryWindow;

app.whenReady().then(() => {
    // ✅ FPS Overlay Window
    overlayWindow = new BrowserWindow({
        width: 300,
        height: 100,
        transparent: true,
        frame: false,
        alwaysOnTop: true,
        fullscreenable: false,
        skipTaskbar: true,
        resizable: false,
        hasShadow: false,
        focusable: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js"),
            backgroundThrottling: false,
        },
    });

    overlayWindow.setAlwaysOnTop(true, "screen-saver", 1);
    overlayWindow.setVisibleOnAllWorkspaces(true);
    overlayWindow.setFullScreenable(false);
    overlayWindow.setIgnoreMouseEvents(true, { forward: true });
    overlayWindow.loadFile(path.join(__dirname, "overlay.html"));

    const { width } = screen.getPrimaryDisplay().bounds;
    overlayWindow.setBounds({ x: width - 310, y: 10, width: 300, height: 100 });

    // ✅ Dashboard Window
    dashboardWindow = new BrowserWindow({
        width: 1400,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false,
            backgroundThrottling: false,
        },
    });

    dashboardWindow.loadURL("http://localhost:5173");

    // ✅ Handle FPS overlay toggle
    ipcMain.on("toggle-fps", () => {
        if (overlayWindow) {
            overlayWindow.isVisible() ? overlayWindow.hide() : overlayWindow.show();
        }
    });

    // ✅ Update FPS overlay stats
    ipcMain.on("update-overlay", (event, data) => {
        if (overlayWindow?.webContents) {
            overlayWindow.webContents.send("update-overlay-stats", data);
        }
    });

    // ✅ Game Library Window
    function createLibraryWindow() {
        libraryWindow = new BrowserWindow({
            width: 1000,
            height: 700,
            title: "Steam Game Library",
            webPreferences: {
                preload: path.join(__dirname, "preload.js"),
                contextIsolation: true,
                nodeIntegration: false,
                backgroundThrottling: false,
            },
        });

        libraryWindow.loadFile(path.join(__dirname, "../frontend/dist/library.html"));

        libraryWindow.on("closed", () => {
            libraryWindow = null;
        });
    }

    ipcMain.on("open-game-library", () => {
        if (!libraryWindow) {
            createLibraryWindow();
        } else {
            libraryWindow.focus();
        }
    });

    // ✅ Handle app close
    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") {
            app.quit();
        }
    });
});
