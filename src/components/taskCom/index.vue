<template>
  <div class="task-block">
    <div class="header">
      <p class="title">待办事项</p>
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
        v-for="item in taskStore.taskList"
        @handle-commit="taskStore.doneTask(item)"
        @handle-cancel="taskStore.cancelTask(item)"
        :title="item.title"
        :time="item.time"
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
  import { ref, Ref, watch, nextTick } from "vue";
  const container: Ref<Element> = ref(null) as any;
  let visible = ref(false);
  const { isBottom } = useBottom(container);
  const taskStore = useTask();
  watch(
    taskStore.taskList,
    () => {
      nextTick(() => {
        console.log(container.value.scrollHeight, container.value.clientHeight);
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
      }
    }
    .container {
      height: 260px;
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
