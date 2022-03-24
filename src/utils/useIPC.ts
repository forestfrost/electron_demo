import { MyTaskItem } from "@/store/types/task";
import { useTask } from "@/store/models/task";
import { ref } from "vue";
const electron = window.require("electron");
const { ipcRenderer } = electron;
// Start 渲染进程频道通信
//设置定时任务
export function setTaskTimer(payload: MyTaskItem) {
  ipcRenderer.send("setTaskTimer", payload);
}
//取消定时任务
export function cancelTaskTimer(payload: MyTaskItem) {
  ipcRenderer.send("cancelTask", payload);
}
//关闭提示面板
export function closeRemindWin() {
  ipcRenderer.send("close:remind");
}
//隐藏主窗口到托盘
export function closeMainWin() {
  ipcRenderer.send("close:main");
}
//最小化主窗口
export function miniMainWin() {
  ipcRenderer.send("mini:main");
}
//发送当前的鼠标的状态
export function sendMouseStatus(payload: string, event?: any) {
  ipcRenderer.send("mouseStatus", payload, event);
}
//全屏或取消全屏
export function maxOrNot() {
  ipcRenderer.send("maxOrNot:main");
}
//选择图片或者视频
export function selectPicOrVideo() {
  ipcRenderer.send("selectPicOrVideo");
}
// End 渲染进程频道通信

// Start 渲染进程监听频道

//向渲染进程发送定时任务信息
export function setRemindMsg() {
  const remindMsg = ref({});
  ipcRenderer.on("setTask", (event, task: MyTaskItem) => {
    remindMsg.value = task;
  });
  return remindMsg;
}
//定时任务提示面板出现后告知渲染进程将该任务置为已完成
export function doneTaskIPC() {
  ipcRenderer.on("setTask", (event, task: MyTaskItem) => {
    useTask().doneTask(task);
  });
}

// End 渲染进程监听频道
