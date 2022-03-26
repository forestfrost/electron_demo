import { IpcMain, ipcMain, IpcMainEvent, screen } from "electron";
import { formatDate, getDiffBetweenDates } from "@/utils/common";
import { createRemindWindow, remindList, win } from "./window";
import { MyTaskItem } from "@/store/types/task";
import { windowStatus, attach } from "./utils/attach";
import { Bert } from "./utils/config";
import schedule from "node-schedule";
export let ipc: IpcMain = ipcMain;
let timerList = new Map();
let scheduleList = new Map();
export const setIPC = () => {
  ipc.on("setTaskTimer", (event: IpcMainEvent, payload: MyTaskItem) => {
    console.log("主进程新建任务", payload);
    if (!payload.cycle) {
      //非重复任务,直接定时器设置即可
      const today = formatDate(new Date(), "YYYY-MM-DD HH:mm:ss");
      const diff = getDiffBetweenDates(today, payload.time, "second");
      const id = setTimeout(() => {
        createRemindWindow(payload);
        win.webContents.send("doneTask", payload);
      }, diff * 1000);
      timerList.set(payload.title, id);
    } else {
      const id = schedule.scheduleJob(payload.cycleRule as string, () => {
        ((payload: MyTaskItem) => {
          createRemindWindow(payload);
        })(payload);
      });
      scheduleList.set(payload.title, id);
    }
  });
  ipc.on("cancelTask", (event: IpcMainEvent, payload) => {
    if (!payload.cycle) {
      if (timerList.has(payload.title)) {
        clearTimeout(timerList.get(payload.title));
      }
    } else {
      if (scheduleList.has(payload.title)) {
        scheduleList.get(payload.title).cancel();
      }
    }
  });
  ipc.on("close:remind", (event, payload: MyTaskItem) => {
    const res = remindList.get(payload.title);
    if (res) {
      res.close();
    }
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
  // ipc.on("selectPicOrVideo", (event, payload) => {
  //   const res = dialog.showOpenDialogSync({
  //     properties: ["openFile"],
  //   });
  //   if (typeof res !== "undefined") {
  //     win.webContents.send("selectPicOrVideo", res);
  //   } else {
  //     win.webContents.send("selectPicOrVideo", []);
  //   }
  // });
};
