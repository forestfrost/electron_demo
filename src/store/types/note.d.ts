declare interface MyTagItem {
  name: string; //maxlen:5
  createTime: string;
  status: "success" | "danger" | "warning";
}
declare interface MyNoteItem {
  title: string; //maxlen:15
  time: string;
  status: "lock" | "normal" | "deleted" | "important";
  tags: Array<MyTagItem>; //maxlen:3
  content: string; // maxlen:1000
}

import "pinia";
declare module "pinia" {
  export interface PiniaCustomProperties {
    noteList: Array<MyNoteItem>;
    notDeletedNoteList: Array<MyNoteItem>;
    tagList: Array<MyTagItem>;
  }
}
