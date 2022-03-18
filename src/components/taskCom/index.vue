<template>
  <div class="task-block">
    <div class="header">
      <p class="title"
        ><span :style="mode === 1 ? { color: '#67c23a' } : {}" @click="toggle(1)">待办事项</span> |
        <span :style="mode === 2 ? { color: '#67c23a' } : {}" @click="toggle(2)">已办事项</span></p
      >
      <div class="btn-block">
        <el-button type="success" circle @click="visible = true">
          <el-icon>
            <plus />
          </el-icon>
        </el-button>
      </div>
    </div>
    <div class="container" ref="container">
      <task-item
        v-for="item in showList"
        @handle-commit="taskStore.doneTask(item)"
        @handle-cancel="taskStore.cancelTask(item)"
        :title="item.title"
        :time="item.time"
        :status="item.status"
      ></task-item>
    </div>

    <el-icon v-show="isBottom" @click="scrollThreeRow(container)" class="icon">
      <arrow-down />
    </el-icon>

    <addDialogVue v-model:visible="visible"></addDialogVue>
  </div>
</template>

<script lang="ts" setup>
  import TaskItem from "./components/taskItem.vue";
  import addDialogVue from "./components/addDialog.vue";
  import { useTask } from "@/store/models/task";
  import { showBottom, useBottom, scrollThreeRow } from "@/hooks/bottom";
  import { ref, Ref, watch, nextTick, computed } from "vue";
  import { doneTaskIPC } from "@/utils/useIPC";
  import { MyTaskItem } from "@/store/types/task";
  doneTaskIPC();
  const container: Ref<Element> = ref(null) as any;
  let visible = ref(false);
  let mode = ref(0); // 当前查看的事项类型 1,待办 2,已办
  const { isBottom } = useBottom(container);
  const taskStore = useTask();
  const taskList = computed(() => {
    return taskStore.taskList;
  });
  const doneList = computed(() => {
    return taskStore.doneList;
  });
  let showList: Ref<Array<MyTaskItem>> = ref([]);
  const toggle = (modeTemp: number) => {
    if (modeTemp === mode.value) return;
    mode.value = modeTemp;
    switch (modeTemp) {
      case 1:
        //待办事项
        showList.value = taskList.value;
        break;
      case 2:
        //已办事项
        showList.value = doneList.value;
        break;
      default:
        showList.value = [];
    }
  };
  toggle(1);
  watch(
    taskStore.taskList,
    () => {
      nextTick(() => {
        showBottom(container);
      });
    },
    {
      deep: true,
    },
  );
</script>
<style lang="less" scoped>
  .task-block {
    position: relative;
    box-sizing: border-box;
    width: 90%;
    padding: 10px;
    box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.1);
    .header {
      display: flex;
      justify-content: space-between;
      .title {
        font-size: 18px;
        font-weight: 600;
        color: gray;
        span {
          cursor: pointer;
        }
      }
    }
    .container {
      height: auto;
      max-height: 260px;
      overflow: auto;
      &::-webkit-scrollbar {
        width: 0px;
        height: 0px;
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
