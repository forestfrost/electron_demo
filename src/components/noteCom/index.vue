<template>
  <div class="note-block block">
    <div class="header">
      <p class="title"
        ><el-icon :size="15" color="#E6A23C" style="top: 2px; margin-right: 3px">
          <document />
        </el-icon>
        <span>日志录</span>
      </p>
      <div class="btn-block">
        <el-button type="success" size="small" circle @click="addNote">
          <el-icon>
            <plus />
          </el-icon>
        </el-button>
      </div>
    </div>
    <div class="container" ref="container">
      <transition-group name="list">
        <note-item
          v-for="item in showList"
          :key="item.title"
          :note="item"
          @handleOperteNote="OperteNote"
          @editNote="editNote"
        ></note-item>
        <template v-if="!showList.length">
          <div class="empty" key="tem_empty_note_block_list"> 现在没有日志录哟,记录一下吧... </div>
        </template>
      </transition-group>
    </div>
    <el-icon v-show="isBottom" @click="scrollThreeRow(container)" class="icon">
      <arrow-down />
    </el-icon>
    <add-drawer
      v-if="visible"
      v-model:visible="visible"
      :note="selectedNote"
      :type="type"
    ></add-drawer>
  </div>
</template>

<script lang="ts" setup>
  import NoteItem from "./components/noteItem.vue";
  import AddDrawer from "./components/addDrawer.vue";
  import { showBottom, useBottom, scrollThreeRow } from "@/hooks/bottom";
  import { useNote } from "@/store/models/note";
  import { Ref } from "vue";
  import { MyNoteItem } from "@/store/types/note";
  const container: Ref<Element> = ref(null) as any; // ref 组件 ,指向日志列表的容器
  const visible = ref(false); // 是否展示输入抽屉
  const selectedNote = ref({}) as Ref<MyNoteItem>; //编辑时选中的日志记录
  const type = ref("add"); //打开抽屉的类型 "add" | "edit" ( 新建 | 编辑)
  const noteStore = useNote();
  const { isBottom } = useBottom(container);
  const showList = computed(() => {
    return noteStore.notDeletedNoteList;
  });
  watch(
    showList,
    () => {
      nextTick(() => {
        showBottom(container);
      });
    },
    {
      deep: true,
    },
  );
  const addNote = () => {
    selectedNote.value = {} as any;
    type.value = "add";
    visible.value = true;
  };
  const editNote = (payload: MyNoteItem) => {
    selectedNote.value = payload;
    type.value = "edit";
    visible.value = true;
  };
  const OperteNote = (payload: MyNoteItem) => {
    noteStore.operateNoteStatus(payload, payload.status);
  };
</script>
<style lang="less" scoped>
  .note-block {
    min-height: 300px;
    .header {
      display: flex;
      justify-content: space-between;
      .title {
        font-size: 13px;
        line-height: 24px;
        font-weight: 600;
        color: gray;
        span {
          color: #67c23a;
        }
      }
    }
    .container {
      height: 260px;
      overflow: auto;
      &::-webkit-scrollbar {
        width: 0px;
        height: 0px;
      }
      .empty {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 12px;
        color: #909399;
      }
    }
    .icon {
      position: absolute;
      background-color: #fff;
      width: 100%;
      height: 30px;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      cursor: pointer;
    }
  }
</style>
