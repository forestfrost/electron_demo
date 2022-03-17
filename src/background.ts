"use strict";

import {
  app,
  protocol,
  BrowserWindow,
  session,
  Tray,
  Menu,
  IpcMain,
  ipcMain,
  IpcMainEvent
} from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import { resolve } from "path";
const isDevelopment = process.env.NODE_ENV !== "production";
const iconPath = resolve(
  "D:\\repo\\electron_demo\\public\\favicon.ico"
);
let tray: Tray;
let win: BrowserWindow;
let ipc: IpcMain = ipcMain;
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } }
]);
//初始化窗口
async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    frame: false,
    width: 1600,
    height: 1200,
    x: 0,
    y: 0,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env
        .ELECTRON_NODE_INTEGRATION as unknown as boolean,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
    }
  });
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }
  // win.removeMenu();
  setTray();
}
//设置系统托盘
function setTray() {
  tray = new Tray(iconPath);
  tray.setToolTip("electron");
  tray.on("click", () => {
    if (win.isVisible()) {
      win.hide();
    } else {
      win.show();
    }
  });
  tray.on("right-click", () => {
    const menuConfig = Menu.buildFromTemplate([
      {
        label: "Quit",
        click: () => {
          app.quit();
        }
      }
    ]);
    tray.popUpContextMenu(menuConfig);
  });
}
// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  createWindow();
});

app.whenReady().then(async () => {
  session.defaultSession.loadExtension(
    resolve("D:\\repo\\devtools\\packages\\shell-chrome")
  );
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}

ipc.on("setTask", (event: IpcMainEvent, payload) => {
  console.log(payload);
});
ipc.on("cancleTask", (event: IpcMainEvent, payload) => {
  console.log(payload);
});
