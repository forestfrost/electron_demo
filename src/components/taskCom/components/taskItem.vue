<template>
  <div class="task-item">
    <div class="flex-space-between">
      <p class="des"> {{ props.title }}</p>
      <p class="des">{{ props.time }}</p>
    </div>

    <div class="operate-block flex-space-between">
      <el-button @click="">
        <template #icon>
          <el-icon>
            <check />
          </el-icon>
        </template>
      </el-button>
      <el-button>
        <template #icon>
          <el-icon>
            <close />
          </el-icon>
        </template>
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const props = defineProps({
    title: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
  });
  const emit = defineEmits(["handleCommit", "handleCancel"]);
</script>
<style lang="less" scoped>
  .task-item {
    display: flex;
    justify-content: space-between;
    .des {
      font-size: 15px;
      color: gray;
    }
    .operate-block {
      width: 60px;
    }
    .flex-space-between {
      display: flex;
      justify-content: space-between;
    }
  }
</style>
