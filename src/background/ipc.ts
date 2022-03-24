import { IpcMain, ipcMain, IpcMainEvent, screen } from "electron";
import { formatDate, getDiffBetweenDates } from "@/utils/common";
import { createRemindWindow, remind, win } from "./window";
import { MyTaskItem } from "@/store/types/task";
import { windowStatus, attach } from "./utils/attach";
import { Bert } from "./utils/config";
export let ipc: IpcMain = ipcMain;
let timerList = new Map();
export const setIPC = () => {
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
};
