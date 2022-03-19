import { defineStore } from "pinia";
import { MyTaskItem } from "../types/task";
import { setTaskTimer, cancelTaskTimer as _cancelTask } from "@/utils/useIPC";
import { DatetoSeconds } from "@/utils/common";
const resort = (taskList: Array<MyTaskItem>) => {
  taskList.sort((a, b) => {
    return DatetoSeconds(a.time) - DatetoSeconds(b.time);
  });
};
export const useTask = defineStore({
  id: "task",
  state: () => {
    return {
      taskList: [],
      doneList: [],
    };
  },
  actions: {
    addTask(payload: MyTaskItem) {
      if (
        this.taskList.findIndex((item: MyTaskItem) => {
          return item.title === payload.title;
        }) !== -1
      ) {
        return false;
      }
      this.taskList.push({ ...payload, status: "wait" });
      resort(this.taskList);
      setTaskTimer(payload);
      return true;
    },
    doneTask(payload: MyTaskItem) {
      const index = this.taskList.findIndex((item: MyTaskItem) => item.title === payload.title);
      if (index !== -1) {
        this.taskList.splice(index, 1);
        this.doneList.push({ ...payload, status: "done" });
        resort(this.doneList);
        _cancelTask({ ...payload });
      }
    },
    cancelTask(payload: MyTaskItem) {
      const index = this.taskList.findIndex((item: MyTaskItem) => item.title === payload.title);
      if (index !== -1) {
        _cancelTask({ ...payload });
        this.taskList.splice(index, 1);
      }
    },
  },
});
