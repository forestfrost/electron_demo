<template>
  <div class="task-item">
    <div class="flex-space-between">
      <p class="des"> {{ props.title }}</p>
      <p class="des">{{ props.time }}</p>
    </div>

    <div class="flex-space-between">
      <el-button circle type="primary" @click="commit">
        <template #icon>
          <el-icon>
            <check />
          </el-icon>
        </template>
      </el-button>
      <el-button circle type="info" @click="cancel">
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
  const commit = () => {
    emit("handleCommit", { title: props.title, time: props.time });
  };
  const cancel = () => {
    emit("handleCancel", { title: props.title, time: props.time });
  };
</script>
<style lang="less" scoped>
  .task-item {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .des {
      font-size: 15px;
      color: gray;
    }
    .flex-space-between {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
</style>
