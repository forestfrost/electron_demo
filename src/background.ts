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
  IpcMainEvent,
  screen,
} from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import { resolve } from "path";
import { getDiffBetweenDates } from "@/utils/common";
import { MyTaskItem } from "./store/types/task";
import { formatDate } from "@/utils/common";
const isDevelopment = process.env.NODE_ENV !== "production";
// const iconPath = resolve("D:\\vscode\\node\\electron_demo\\public\\favicon.ico");
const iconPath = resolve(process.env.VUE_APP_ICON_PATH as string);
let tray: Tray;
let win: BrowserWindow;
let remind: BrowserWindow;
let ipc: IpcMain = ipcMain;
let timerList = new Map();
//初始化主窗口
async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    frame: false,
    width: 1600,
    height: 1200,
    x: 0,
    y: 0,
    webPreferences: {
      backgroundThrottling: false,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL(`file:/${__dirname}/index.html`);
  }
  // win.removeMenu();
  setTray();
}
async function createRemindWindow(task: MyTaskItem) {
  remind = new BrowserWindow({
    frame: false,
    width: 320,
    height: 380,
    icon: iconPath,
    resizable: false,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  remind.removeMenu();
  const size = screen.getPrimaryDisplay().workAreaSize;
  const { y } = tray.getBounds();
  const { width, height } = remind.getBounds();
  const yPosition = process.platform === "darwin" ? y : y - height;
  remind.setBounds({
    x: size.width - width,
    y: yPosition,
    height,
    width,
  });
  remind.setAlwaysOnTop(true);

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    remind.loadURL(process.env.WEBPACK_DEV_SERVER_URL + "/remind.html");
  } else {
    createProtocol("app");
    remind.loadURL(`app://./remind.html`);
  }
  remind.show();
  remind.on("closed", () => {
    remind = null as any;
  });
  setTimeout(() => {
    remind && remind.close();
  }, 50 * 1000);
  remind.webContents.on("did-finish-load", () => {
    remind.webContents.send("setTask", task);
  });
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
        },
      },
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
  app.whenReady().then(async () => {
    session.defaultSession.loadExtension(resolve(process.env.VUE_APP_EXTENSION_PATH as string));
  });
}

ipc.on("setTaskTimer", (event: IpcMainEvent, payload: MyTaskItem) => {
  const today = formatDate(new Date(), "YYYY-MM-DD HH:mm:ss");
  const diff = getDiffBetweenDates(today, payload.time);
  const id = setTimeout(() => {
    createRemindWindow(payload);
    win.webContents.send("setTask", payload);
  }, diff);
  timerList.set(payload.title, id);
});
ipc.on("cancelTask", (event: IpcMainEvent, payload) => {
  console.log("cancel", payload);
  if (timerList.has(payload.title)) {
    clearTimeout(timerList.get(payload.title));
  }
});
