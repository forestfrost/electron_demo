<template>
  <div class="task-item flex-space-between" @mouseenter="enter" @mouseleave="leave">
    <div class="lt">
      <div>
        <p class="des"> {{ props.title }}</p>
        <p class="des special-des">
          <el-icon class="icon">
            <clock /> </el-icon
          >{{ time }}{{ props.cycle ? `(${props.cycleType})` : "" }}</p
        >
        <p class="des special-des">{{ props.remark }}</p>
      </div>
    </div>

    <div v-if="props.status == 'wait'" class="rt" :style="{ opacity: opacity }">
      <el-button size="small" circle type="primary" @click="handleEdit">
        <el-icon>
          <edit />
        </el-icon>
      </el-button>
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
  const props = defineProps<{
    title: string;
    time: Date | string;
    status?: string;
    remark?: string;
    cycle: boolean;
    cycleType?: string;
  }>();
  const emit = defineEmits(["handleCommit", "handleCancel", "handleEdit"]);
  const commit = () => {
    emit("handleCommit");
  };
  const cancel = () => {
    emit("handleCancel");
  };
  const handleEdit = () => {
    emit("handleEdit");
  };
  const time = computed(() => {
    return formatDate(props.time, "HH:mm:ss");
  });

  const opacity = ref(0);
  const enter = () => {
    opacity.value = 1;
  };
  const leave = () => {
    opacity.value = 0;
  };
</script>
<style lang="less" scoped>
  .task-item {
    overflow: hidden;
    width: 100%;
    height: 50px;
    box-sizing: border-box;
    .des {
      min-width: 120px;
      margin-right: 16px;
      font-size: 12px;
      color: gray;
    }
    .special-des {
      min-width: 50px;
      display: inline-block;
      .icon {
        top: 2px;
        margin-right: 3px;
      }
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
    transition: 1.2s;
  }
</style>
