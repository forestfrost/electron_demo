import { defineStore } from "pinia";
import { MyTaskItem } from "../types/task";

export const useTask = defineStore({
  id: "task",
  state: () => {
    return {
      taskList: [],
    };
  },
  actions: {
    addTask(payload: MyTaskItem) {
      this.taskList.push(payload);
    },
  },
});
