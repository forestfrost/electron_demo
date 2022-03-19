<template>
  <div class="task-block block">
    <div class="header">
      <p class="title"
        ><span :style="mode === 1 ? { color: '#67c23a' } : {}" @click="toggle(1)">待办事项</span> |
        <span :style="mode === 2 ? { color: '#67c23a' } : {}" @click="toggle(2)">已办事项</span></p
      >
      <div class="btn-block">
        <el-button type="success" size="small" circle @click="visible = true">
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
        :remark="item.remark"
      ></task-item>
      <template v-if="!showList.length">
        <div v-if="mode === 1" class="empty"> 现在没有待办的事情哟,休息一下吧... </div>
        <div v-else-if="mode === 2" class="empty">现在没有已办的事情哟,快动起来吧...</div>
      </template>
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
</script>
<style lang="less" scoped>
  .task-block {
    .header {
      display: flex;
      justify-content: space-between;
      .title {
        font-size: 13px;
        font-weight: 600;
        color: gray;
        span {
          cursor: pointer;
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
