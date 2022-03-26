<template>
  <div class="task-block block">
    <div class="header">
      <p class="title"
        ><el-icon :size="15" color="#E6A23C" class="title-icon">
          <alarm-clock />
        </el-icon>
        <span :style="mode === 1 ? { color: '#67c23a' } : {}" @click="toggle(1)">待办事项</span> |
        <span :style="mode === 2 ? { color: '#67c23a' } : {}" @click="toggle(2)">已办事项</span>
        <el-icon
          :size="15"
          :class="['title-icon', 'pointer', !comOpen ? 'rorate' : '']"
          @click="openOrClose"
        >
          <arrow-down />
        </el-icon>
      </p>
      <div>
        <el-button type="success" size="small" circle @click="operateTask({} as any, 'add')">
          <el-icon>
            <plus />
          </el-icon>
        </el-button>
      </div>
    </div>
    <div class="container" ref="container" :class="[conClass, comOpen ? 'h-260' : 'h-0']">
      <transition-group name="list">
        <task-item
          v-for="item in showList"
          @handle-commit="taskStore.doneTask(item, true)"
          @handle-cancel="taskStore.cancelTask(item)"
          @handle-edit="operateTask(item, 'edit')"
          :title="item.title"
          :time="item.time"
          :status="item.status"
          :remark="item.remark"
          :cycle="item.cycle"
          :cycle-type="item.cycleType"
          :key="item.title + item.time + item.status"
        ></task-item>
        <template v-if="!showList.length">
          <div v-if="mode === 1" class="empty" key="tem_empty_task_block_list_1">
            现在没有待办的事情哟,休息一下吧...
          </div>
          <div v-else-if="mode === 2" class="empty" key="tem_empty_task_block_list_2"
            >现在没有已办的事情哟,快动起来吧...</div
          >
        </template>
      </transition-group>
    </div>
    <el-icon v-show="isBottom && comOpen" @click="scrollThreeRow(container)" class="icon">
      <arrow-down />
    </el-icon>

    <!-- <addDialogVue v-model:visible="visible"></addDialogVue> -->
    <addDrawerVue v-model:visible="visible" :type="type" :task-detail="selectedTask"></addDrawerVue>
  </div>
</template>

<script lang="ts" setup>
  import TaskItem from "./components/taskItem.vue";
  import addDrawerVue from "./components/addDrawer.vue";
  import { useTask } from "@/store/models/task";
  import { showBottom, useBottom, scrollThreeRow } from "@/hooks/bottom";
  import { watchComOpen } from "@/hooks/openOrClose";
  import { ref, Ref, watch, nextTick, computed } from "vue";
  import { doneTaskIPC, appReady } from "@/utils/useIPC";
  import { MyTaskItem } from "@/store/types/task";
  doneTaskIPC();
  appReady();
  const container: Ref<Element> = ref(null) as any;

  let visible = ref(false);
  const type = ref("");
  let selectedTask: Ref<MyTaskItem> = ref(null) as any;
  const operateTask = (task: MyTaskItem, typeTemp: string) => {
    selectedTask.value = task;
    type.value = typeTemp;
    visible.value = true;
  };
  let mode = ref(0); // 当前查看的事项类型 1,待办 2,已办
  const isBottom = ref(false);
  useBottom(container, isBottom);
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
        showBottom(container, isBottom);
      });
    },
    {
      deep: true,
    },
  );

  const comOpen = ref(true);
  const openOrClose = () => {
    comOpen.value = !comOpen.value;
  };
  const conClass = ref("");
  watchComOpen(comOpen, conClass);
  watch(
    conClass,
    () => {
      setTimeout(() => {
        showBottom(container, isBottom);
      }, 600);
    },
    {
      flush: "post",
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
        line-height: 24px;
        font-weight: 600;
        color: gray;
        span {
          cursor: pointer;
        }
        .title-icon {
          top: 2px;
          margin-right: 3px;
        }
        .pointer {
          margin-left: 3px;
          cursor: pointer;
          transition: 0.3s;
        }
        .rorate {
          transform: rotateZ(-90deg);
        }
      }
    }
    .container {
      // height: 260px;
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
