"use strict";
import {
  app,
  BrowserWindow,
  session,
  Tray,
  Menu,
  IpcMain,
  ipcMain,
  IpcMainEvent,
  screen,
  Notification,
} from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import { resolve } from "path";
import { getDiffBetweenDates, debounce } from "@/utils/common";
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
let windowStatus: "show" | "hide:top" | "hide:left" | "hide:right" = "show";
const Bert = 6;
//初始化主窗口
async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    frame: false,
    resizable: true,
    width: 600,
    height: 800,
    minWidth: 600,
    webPreferences: {
      backgroundThrottling: false,
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    },
  });
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL(`file://${__dirname}/index.html`);
  }
  // win.removeMenu();
  attachHide(win, attach);
  setTray();
}
//创建定时任务提醒窗体
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
  showNotification("快动起来吧", task.title, task.remark);
  setTimeout(() => {
    remind && remind.close();
  }, 50 * 1000);
  remind.webContents.on("did-finish-load", () => {
    remind.webContents.send("setTask", task);
  });
}
//设置系统托盘(为主窗口(win)设置)
function setTray() {
  tray = new Tray(iconPath);
  tray.setToolTip("工作台");
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
function attach(window: BrowserWindow) {
  //获取当前窗口左上角的位置坐标
  const [x, y] = window.getPosition();
  const { width, height } = window.getBounds();
  const { width: clientWidth, height: clientHeight } = screen.getPrimaryDisplay().bounds;
  let distance;
  if (windowStatus === "show") {
    if (y <= 5 && !window.isFullScreen()) {
      distance = y + height - Bert;
      aninateForHideOrShow("top", distance);
    } else if (x <= 5) {
      distance = x + width - Bert;
      aninateForHideOrShow("left", distance);
    } else if (x > clientWidth - width - 5) {
      distance = clientWidth - x - Bert;
      aninateForHideOrShow("right", distance);
    }
  } else if (windowStatus === "hide:left") {
    distance = width - Bert;
    aninateForHideOrShow("right-show", distance);
  } else if (windowStatus === "hide:right") {
    distance = width - Bert;
    aninateForHideOrShow("left-show", distance);
  } else {
    distance = height - Bert;
    aninateForHideOrShow("bottom", distance);
  }
}
function aninateForHideOrShow(
  direction: "top" | "bottom" | "left" | "right" | "left-show" | "right-show",
  distance: number,
) {
  let [x, y] = win.getPosition();
  let timer: NodeJS.Timer;
  const distancePerFrame = 100;
  switch (direction) {
    case "top":
      timer = setInterval(() => {
        if (distance > distancePerFrame) {
          win.setPosition(x, y - distancePerFrame);
          distance -= distancePerFrame;
          y -= distancePerFrame;
          if (distance == 0) {
            windowStatus = "hide:top";
          }
        } else {
          win.setPosition(x, y - distance);
          clearInterval(timer);
          windowStatus = "hide:top";
        }
      }, 16);

      break;
    case "right":
    case "right-show":
      timer = setInterval(() => {
        if (distance > distancePerFrame) {
          win.setPosition(x + distancePerFrame, y);
          distance -= distancePerFrame;
          x += distancePerFrame;
          if (distance == 0) {
            windowStatus = direction == "right" ? "hide:right" : "show";
          }
        } else {
          win.setPosition(x + distance, y);
          clearInterval(timer);
          windowStatus = direction == "right" ? "hide:right" : "show";
        }
      }, 16);
      break;
    case "bottom":
      timer = setInterval(() => {
        if (distance > distancePerFrame) {
          win.setPosition(x, y + distancePerFrame);
          distance -= distancePerFrame;
          y += distancePerFrame;
          if (distance == 0) {
            windowStatus = "show";
          }
        } else {
          win.setPosition(x, y + distance);
          clearInterval(timer);
          windowStatus = "show";
        }
      }, 16);
      break;
    case "left":
    case "left-show":
      timer = setInterval(() => {
        if (distance > distancePerFrame) {
          win.setPosition(x - distancePerFrame, y);
          distance -= distancePerFrame;
          x -= distancePerFrame;
          if (distance == 0) {
            windowStatus = direction == "left" ? "hide:left" : "show";
          }
        } else {
          win.setPosition(x - distance, y);
          clearInterval(timer);
          windowStatus = direction == "left" ? "hide:left" : "show";
        }
      }, 16);
      break;
  }
}

//设置窗口的边缘贴附
function attachHide(window: BrowserWindow, cb: Function) {
  window.addListener("moved", () => {
    cb(window);
  });
}
function cancelAttachHide(window: BrowserWindow, cb: Function) {
  window.removeListener("moved", cb);
}
function showNotification(title: string, body?: string, subtitle?: string) {
  new Notification({
    title,
    body,
    subtitle,
    icon: iconPath,
    silent: false,
  }).show();
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
