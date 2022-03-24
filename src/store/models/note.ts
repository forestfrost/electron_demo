import { defineStore } from "pinia";
import { MyNoteItem, MyTagItem } from "../types/note";
import { DatetoSeconds } from "@/utils/common";
//置顶功能重排序
const resort = (array: Array<MyNoteItem>) => {
  let temp: Array<MyNoteItem> = [];
  for (let i = array.length - 1; i >= 0; i--) {
    if (array[i].status === "important") {
      temp.push(JSON.parse(JSON.stringify(array[i])));
      array.splice(i, 1);
    }
  }
  temp.sort((a, b) => {
    return DatetoSeconds(a.time) - DatetoSeconds(b.time);
  });
  temp.forEach((item) => {
    array.unshift(item);
  });
};
export const useNote = defineStore({
  id: "note",
  state: () => {
    return {
      tagList: [
        {
          name: "测试",
          createTime: "2022-03-22 09:38:16",
          status: "success",
        },
        {
          name: "活动",
          createTime: "2022-03-22 09:38:16",
          status: "danger",
        },
        {
          name: "知识",
          createTime: "2022-03-22 09:38:16",
          status: "warning",
        },
      ],
      noteList: [
        {
          title: "关于我一直痴心妄想这件事",
          time: "2022-03-22 09:38:16",
          status: "lock",
          tags: [
            {
              name: "测试",
              createTime: "2022-03-22 09:38:16",
              status: "success",
            },
          ],
          content: "这是内容",
        },
      ],
    };
  },
  getters: {
    notDeletedNoteList: (state) => {
      return state.noteList.filter((item) => {
        return item.status !== "deleted";
      });
    },
  },
  actions: {
    //增加或修改日志录
    addNote(payload: MyNoteItem, add: boolean = true) {
      const index = this.noteList.findIndex((item: MyNoteItem) => {
        return item.title === payload.title && item.status !== "deleted";
      });
      if (add && index !== -1) {
        return false;
      }
      if (!add && index !== -1) {
        this.noteList[index] = payload;
        resort(this.noteList);
        return true;
      } else if (!add && index == -1) {
        return false;
      }
      this.noteList.push({ ...payload, status: payload.status ? payload.status : "normal" });
      resort(this.noteList);
      return true;
    },
    //操作日志录的状态
    operateNoteStatus(payload: MyNoteItem, status: "lock" | "normal" | "deleted" | "important") {
      const index = this.noteList.findIndex((item: MyNoteItem) => item.title === payload.title);
      if (index == -1) return;
      this.noteList[index].status = status;
    },
    //新增标签
    addTag(payload: MyTagItem) {
      const index = this.tagList.findIndex((item) => item.name == payload.name);
      if (index !== -1) {
        return false;
      }
      this.tagList.push(payload);
      return true;
    },
  },
});
