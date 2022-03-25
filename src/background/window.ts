import { BrowserWindow, Tray, screen, Menu, app } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import { attachHide, attach } from "./utils/attach";
import { showNotification } from "./notification";
import { iconPath } from "./utils/config";
import { MyTaskItem } from "@/store/types/task";
export let win: BrowserWindow;
export let remindList: Map<string, BrowserWindow> = new Map();
export let tray: Tray;
//初始化主窗口
export async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    frame: false,
    resizable: true,
    width: 600,
    height: 800,
    minWidth: 600,
    maxWidth: 900,
    minHeight: 800,
    maximizable: false,
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
    await win.loadURL(`file://${__dirname}/index.html`);
    win.removeMenu();
  }
  attachHide(win, attach);
  setTray();
}
//创建定时任务提醒窗体
export async function createRemindWindow(task: MyTaskItem) {
  const remind = new BrowserWindow({
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
  remindList.set(task.title, remind);
  // remind.removeMenu();
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
    await remind.loadURL(process.env.WEBPACK_DEV_SERVER_URL + "/remind.html");
  } else {
    createProtocol("app");
    await remind.loadURL(`app://./remind.html`);
  }
  remind.show();
  remind.on("closed", () => {
    let temp = task;
    remindList.get(temp.title) && remindList.set(temp.title, null as any);
  });
  showNotification("快动起来吧", task.title, task.remark);
  setTimeout(() => {
    let temp = task;
    const res = remindList.get(temp.title);
    if (res) {
      res.close();
    }
  }, 15 * 1000);
  remind.webContents.send("setTask", task);
}
//设置系统托盘(为主窗口(win)设置)
export function setTray() {
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
