<template>
  <div class="task-item">
    <div class="flex-space-between">
      <p class="des"> {{ props.title }}</p>
      <p class="des">{{ time }}</p>
      <p class="des">{{ props.remark }}</p>
    </div>

    <div class="flex-space-between">
      <el-button v-if="props.status == 'wait'" size="small" circle type="primary" @click="commit">
        <template #icon>
          <el-icon>
            <check />
          </el-icon>
        </template>
      </el-button>
      <el-button v-if="props.status == 'wait'" size="small" circle type="danger" @click="cancel">
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
  import { formatDate } from "@/utils/common";
  const props = defineProps({
    title: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    status: {
      type: String,
    },
    remark: {
      type: String,
    },
  });
  const emit = defineEmits(["handleCommit", "handleCancel"]);
  const commit = () => {
    emit("handleCommit", { title: props.title, time: props.time });
  };
  const cancel = () => {
    emit("handleCancel", { title: props.title, time: props.time });
  };
  const time = computed(() => {
    if (props.status === "wait") {
      return formatDate(props.time, "HH:mm");
    } else if (props.status === "done") {
      return props.time;
    }
  });
</script>
<style lang="less" scoped>
  .task-item {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .des {
      min-width: 100px;
      margin-right: 16px;
      font-size: 12px;
      color: gray;
    }
    .flex-space-between {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
</style>
