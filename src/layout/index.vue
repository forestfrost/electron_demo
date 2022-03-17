<template>
  <div class="layout">
    <div class="lt"></div>
    <div class="rt">
      <Task></Task>
      <Note></Note>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Task from "@/components/taskCom/index.vue";
import Note from "@/components/noteCom/index.vue";
</script>

<style lang="less" scoped>
.layout {
  display: flex;
  min-width: 1200px;
  min-height: 800px;
  .lt {
    width: 50%;
  }
  .rt {
    width: 50%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
  }
}
</style>
