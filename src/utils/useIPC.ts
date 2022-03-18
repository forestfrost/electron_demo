import { MyTaskItem } from "@/store/types/task";
import { useTask } from "@/store/models/task";
import { Ref } from "vue";
const electron = window.require("electron");
const { ipcRenderer } = electron;
export function setTaskTimer(payload: MyTaskItem) {
  ipcRenderer.send("setTaskTimer", payload);
}
export function cancelTaskTimer(payload: MyTaskItem) {
  ipcRenderer.send("cancelTask", payload);
}
export function setRemindMsg() {
  const remindMsg = ref({});
  ipcRenderer.on("setTask", (event, task: MyTaskItem) => {
    remindMsg.value = task;
  });
  return remindMsg;
}
export function doneTaskIPC() {
  ipcRenderer.on("setTask", (event, task: MyTaskItem) => {
    useTask().doneTask(task);
  });
}