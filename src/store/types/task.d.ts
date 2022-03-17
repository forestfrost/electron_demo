declare interface MyTaskItem {
  title: string;
  time: string;
}
import "pinia";

declare module "pinia" {
  export interface PiniaCustomProperties {
    taskList: Array<MyTaskItem>;
  }
}
