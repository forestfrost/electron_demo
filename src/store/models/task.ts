import { defineStore } from "pinia";
import { MyTaskItem } from "../types/task";
import { setTaskTimer, cancelTaskTimer as _cancelTask } from "@/utils/useIPC";
import { DatetoSeconds, Before, getDiffBetweenDates } from "@/utils/common";
const resort = (taskList: Array<MyTaskItem>) => {
  taskList.sort((a, b) => {
    return DatetoSeconds(a.time) - DatetoSeconds(b.time);
  });
};
export const useTask = defineStore({
  id: "task",
  persist: {
    enabled: true,
    strategies: [
      {
        key: "taskList",
        storage: localStorage,
        paths: ["taskList"],
      },
      {
        key: "doneList",
        storage: localStorage,
        paths: ["doneList"],
      },
    ],
  },
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
    /**
     *
     * @param payload 任务实例
     * @param force 是否强制置为已办状态,默认为false
     */
    doneTask(payload: MyTaskItem, force: boolean = false) {
      const index = this.taskList.findIndex((item: MyTaskItem) => item.title === payload.title);
      if (index !== -1) {
        if (!payload.cycle && !force) return;
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
    /**
     * @description 重启应用时重载定时任务
     */
    reloadTask() {
      console.log("渲染进程重载定时任务----start");
      const now = new Date();
      const taskList = JSON.parse(JSON.stringify(this.taskList));
      const taskListLen = this.taskList.length;
      const doneListLen = this.doneList.length;
      this.taskList = [];
      console.log(taskList);
      //对于待办事项 : 1,重复任务直接重载 2,对于过期的非重复任务直接删除,剩余的重新重载
      for (let i = taskListLen - 1; i >= 0; i--) {
        const item: MyTaskItem = taskList[i];
        console.log(item.time, now, Before(item.time, now));
        if (Before(item.time, now) && !item.cycle) {
          taskList.splice(i, 1);
        } else {
          this.addTask(item);
        }
      }
      //对于已办事项,非今日的直接删除,其余的进行保留
      for (let i = doneListLen - 1; i >= 0; i--) {
        const item: MyTaskItem = this.doneList[i];
        if (getDiffBetweenDates(item.time, now, "day") !== 0) {
          this.doneList.splice(i, 1);
        }
      }
      console.log("渲染进程重载定时任务----end");
    },
  },
});
