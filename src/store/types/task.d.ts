declare interface MyTaskItem {
  title: string;
  time: Date;
  remark?: string;
  status?: "wait" | "done";
  cycle: boolean;
  cycleRule?: string;
  cycleType?: string;
}
import "pinia";

declare module "pinia" {
  export interface PiniaCustomProperties {
    taskList: Array<MyTaskItem>;
    doneList: Array<MyTaskItem>;
  }
}
