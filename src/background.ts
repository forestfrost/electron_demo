"use strict";
import { app, BrowserWindow, session, IpcMain, ipcMain, IpcMainEvent, screen } from "electron";
import { resolve } from "path";
import { getDiffBetweenDates } from "@/utils/common";
import { MyTaskItem } from "./store/types/task";
import { formatDate } from "@/utils/common";
import { showNotification } from "./background/notification";
import { isDevelopment, Bert, extensionPath } from "./background/utils/config";
import { windowStatus, attach } from "./background/utils/attach";
import { win, remind, createWindow, createRemindWindow } from "./background/window";
let ipc: IpcMain = ipcMain;
let timerList = new Map();

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
app.on("ready", async () => {
  createWindow();
});
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
    session.defaultSession.loadExtension(resolve(extensionPath as string));
    showNotification("提示", "工作台已经启动啦");
  });
}

ipc.on("setTaskTimer", (event: IpcMainEvent, payload: MyTaskItem) => {
  const today = formatDate(new Date(), "YYYY-MM-DD HH:mm:ss");
  const diff = getDiffBetweenDates(today, payload.time, "minute");
  const id = setTimeout(() => {
    createRemindWindow(payload);
    win.webContents.send("setTask", payload);
  }, diff * 60 * 1000);
  timerList.set(payload.title, id);
});
ipc.on("cancelTask", (event: IpcMainEvent, payload) => {
  console.log("cancel", payload);
  if (timerList.has(payload.title)) {
    clearTimeout(timerList.get(payload.title));
  }
});
ipc.on("close:remind", (event) => {
  remind.close();
});
ipc.on("close:main", () => {
  win.hide();
});
ipc.on("mini:main", () => {
  win.minimize();
});
ipc.on("maxOrNot:main", () => {
  const res = win.isMaximized();
  res ? win.unmaximize() : win.maximize();
});
ipc.on("mouseStatus", (event: IpcMainEvent, payload: string, DomEvent: any) => {
  const { width: clientWidth } = screen.getPrimaryDisplay().bounds;
  if (payload !== "LEAVE" && windowStatus !== "show") {
    attach(win);
  } else if (
    payload === "LEAVE" &&
    windowStatus == "show" &&
    DomEvent.screenX >= Bert &&
    DomEvent.screenY > 29 &&
    DomEvent.clientY > 29 &&
    DomEvent.screenX < clientWidth - Bert
  ) {
    attach(win);
  }
});
