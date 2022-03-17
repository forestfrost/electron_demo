<template>
  <el-dialog v-model="_visible" :close-on-click-modal="false" width="30%" center>
    <div class="task-com-dialog-con">
      <div class="row">
        <p class="label">名称：</p>
        <el-input v-model="form.name" clearable placeholder="请输入"></el-input>
      </div>
      <div class="row">
        <p class="label">时间：</p>
        <el-time-select
          v-model="form.time"
          start="08:30"
          step="00:05"
          end="22:30"
          placeholder="请选择"
        />
      </div>
    </div>
    <template #title>
      <p class="task-dialog-title">新建任务</p>
    </template>
    <template #footer>
      <el-button @click="submit" type="success" size="small">确认</el-button>
      <el-button @click="visible = false" type="info" size="small" plain>返回</el-button>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
  import { reactive, computed } from "vue";
  import { useTask } from "@/store/models/task";
  import { ElMessage } from "element-plus";

  const props = defineProps({
    visible: {
      type: Boolean,
      required: true,
    },
  });
  const emit = defineEmits(["update:visible"]);
  const _visible = computed({
    set(val) {
      emit("update:visible", val);
    },
    get() {
      return props.visible;
    },
  });
  const form = reactive({
    name: "",
    time: "",
  });
  const submit = () => {
    if (form.name == "") {
      ElMessage.error("请输入任务名称");
      return;
    } else if (form.time == "") {
      ElMessage.error("请选择时间");
      return;
    }
    const taskStore = useTask();
    taskStore.addTask({
      title: form.name,
      time: form.time,
    });
    ElMessage.success("新建成功");
    _visible.value = false;
  };
</script>
<style lang="less">
  .el-dialog {
    min-width: 600px;
    .task-dialog-title {
      font-size: 12px;
      font-weight: 600;
    }
    .task-com-dialog-con {
      width: 300px;
      margin: 0 auto;
      .row {
        margin: 16px auto;
        display: flex;
        align-items: center;
      }
      .label {
        color: gray;
        font-size: 12px;
      }
      .el-input {
        width: 200px;
      }
    }
  }
</style>
