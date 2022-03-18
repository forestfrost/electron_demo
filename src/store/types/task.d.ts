declare interface MyTaskItem {
  title: string;
  time: string;
  status?: "wait" | "done";
}
import "pinia";

declare module "pinia" {
  export interface PiniaCustomProperties {
    taskList: Array<MyTaskItem>;
    doneList: Array<MyTaskItem>;
  }
}
