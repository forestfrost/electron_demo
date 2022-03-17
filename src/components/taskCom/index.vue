<template>
  <div class="task-block">
    <div class="header">
      <p class="title">待办事项</p>
      <div class="btn-block">
        <el-button type="success" circle>
          <el-icon>
            <plus />
          </el-icon>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>
<style lang="less" scoped>
  .task-block {
    box-sizing: border-box;
    width: 90%;
    padding: 10px;
    min-height: 300px;
    box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.1);
    .header {
      display: flex;
      justify-content: space-between;
      .title {
        font-size: 18px;
        font-weight: 600;
        color: #67c23a;
      }
    }
  }
</style>
