<template>
  <div class="header">
    <div class="lt">
      <el-image :src="avator" style="width: 16px; padding: 3px" />
      <p class="title">工作台</p>
    </div>
    <div class="rt">
      <div class="item" @click="miniMainWin">
        <el-icon><minus /></el-icon>
      </div>
      <div class="item" @click="_maxOrNot">
        <el-icon v-if="!isMaximized"><full-screen /></el-icon>
        <el-icon v-else><copy-document /></el-icon>
      </div>
      <div class="item close" @click="closeMainWin">
        <el-icon><close /></el-icon>
      </div>
    </div>
  </div>
  <div class="layout">
    <div class="row">
      <Task></Task>
    </div>
    <div class="row">
      <Note></Note>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import Task from "@/components/taskCom/index.vue";
  import Note from "@/components/noteCom/index.vue";
  import avator from "@/assets/yjtp.png";
  import { closeMainWin, miniMainWin, maxOrNot } from "@/utils/useIPC";

  const isMaximized = ref(false);
  const _maxOrNot = () => {
    isMaximized.value = !isMaximized.value;
    maxOrNot();
  };
</script>

<style lang="less" scoped>
  .header {
    -webkit-app-region: drag;
    display: flex;
    justify-content: space-between;
    height: 29px;
    border-bottom: #ebeef5 1px solid;
    font-size: 11px;
    .lt {
      display: flex;
      align-items: center;
      .title {
        margin: 0 12px;
      }
    }
    .rt {
      display: flex;
      align-items: center;
      .item {
        -webkit-app-region: no-drag;
        padding: 6px 12px;
        cursor: pointer;
        &:hover {
          background-color: #529b2e;
        }
      }
      .close:hover {
        background-color: #f56c6c;
      }
    }
  }
  .layout {
    display: flex;
    min-width: 560px;
    height: calc(100% - 30px);
    flex-direction: column;
    align-items: center;
    .row {
      width: 100%;
      margin: 32px auto;
    }
    overflow: auto;
    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    &::-webkit-scrollbar-track {
      background-color: #f2f6fc;
      border-radius: 12px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 12px;
      width: 6px;
      height: 6px;
      background-color: #529b2e;
    }
  }
</style>
