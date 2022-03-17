import { defineStore } from "pinia";
import { MyTaskItem } from "../types/task";
export const useTask = defineStore({
  id: "task",
  state: () => {
    return {
      count: 0,
      taskList: [
        {
          title: "吃饭",
          time: "14:00",
        },
        {
          title: "喝酒",
          time: "16:00",
        },
        {
          title: "睡觉",
          time: "21:00",
        },
      ],
      doneList: [],
    };
  },
  actions: {
    addTask(payload: MyTaskItem) {
      this.taskList.push(payload);
    },
    doneTask(payload: MyTaskItem) {
      this.doneList.push(payload);
    },
    cancelTask(payload: MyTaskItem) {
      const index = this.taskList.findIndex((item) => item.title === payload.title);
      if (index !== -1) {
        this.taskList.splice(index, 1);
      }
    },
  },
});
