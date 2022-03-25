<template>
  <div class="task-item flex-space-between" @mouseenter="enter" @mouseleave="leave">
    <div class="flex-space-between">
      <p class="des"> {{ props.title }}</p>
      <p class="des special-des">{{ time }}{{ `(${props.cycleType})` }}</p>
      <p class="des">{{ props.remark }}</p>
    </div>

    <div
      v-if="props.status == 'wait'"
      class="rt"
      :style="{ transform: `translateX(${distance}px)` }"
    >
      <el-button size="small" circle type="primary" @click="commit">
        <template #icon>
          <el-icon>
            <check />
          </el-icon>
        </template>
      </el-button>
      <el-button size="small" circle type="danger" @click="cancel">
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
      type: Date,
      required: true,
    },
    status: {
      type: String,
    },
    remark: {
      type: String,
    },
    cycle: {
      type: Boolean,
      required: true,
    },
    cycleType: {
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
    return formatDate(props.time, "HH:mm:ss");
  });

  const distance = ref(100);
  const enter = () => {
    distance.value = 0;
  };
  const leave = () => {
    distance.value = 100;
  };
</script>
<style lang="less" scoped>
  .task-item {
    width: 100%;
    height: 50px;
    .des {
      min-width: 120px;
      margin-right: 16px;
      font-size: 12px;
      color: gray;
    }
    .special-des {
      min-width: 50px;
    }
    &:hover {
      box-shadow: 0 1px rgb(0 0 0 / 10%);
    }
  }
  .flex-space-between {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .rt {
    transition: 0.6s;
  }
</style>
