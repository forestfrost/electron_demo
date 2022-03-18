<template>
  <el-dialog
    v-model="_visible"
    :close-on-click-modal="false"
    width="30%"
    center
    custom-class="task-add-dialog"
    @close="closeDialog(ruleForm)"
  >
    <div class="task-com-dialog-con">
      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100">
        <el-form-item prop="name" label="名称">
          <el-input
            v-model.trim="form.name"
            clearable
            placeholder="请输入"
            maxLength="30"
            :show-word-limit="true"
          ></el-input>
        </el-form-item>
        <el-form-item prop="time" label="时间">
          <el-time-select
            v-model="form.time"
            :start="formatDate(now, 'HH:mm')"
            step="00:15"
            end="22:30"
            placeholder="请选择"
          />
        </el-form-item>
      </el-form>
    </div>
    <template #title>
      <p class="task-dialog-title">新建任务</p>
    </template>
    <template #footer>
      <el-button @click="submit(ruleForm)" type="success" size="small">确认</el-button>
      <el-button @click="_visible = false" size="small" plain>返回</el-button>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
  import { reactive, computed, ref, WritableComputedRef } from "vue";
  import { useTask } from "@/store/models/task";
  import { ElMessage, FormInstance } from "element-plus";
  import { formatDate, Before, setDateByHoursAndMinutes } from "@/utils/common";
  const props = defineProps({
    visible: {
      type: Boolean,
      required: true,
    },
  });
  const emit = defineEmits(["update:visible"]);
  const _visible: WritableComputedRef<boolean> = computed({
    set(val) {
      emit("update:visible", val);
    },
    get() {
      return props.visible;
    },
  });
  let form = reactive({
    name: "",
    time: "",
  });
  let now = new Date();
  now.setMinutes(now.getMinutes() + 5);
  const checkTime = (rule: any, value: string, cb: any) => {
    if (Before(setDateByHoursAndMinutes(value), formatDate(new Date(), "YYYY-MM-DD HH:mm:ss"))) {
      return cb(new Error("选择时间已经过去啦"));
    }
    cb();
  };
  const rules = reactive({
    name: [{ required: true, message: "请输入任务名称", trigger: "change" }],
    time: [
      { required: true, message: "请选择时间", trigger: "change" },
      {
        validator: checkTime,
        trigger: "change",
      },
    ],
  });
  const ruleForm = ref<FormInstance>();
  const submit = (ruleForm: FormInstance | undefined) => {
    if (!ruleForm) return;
    ruleForm.validate((valid) => {
      if (valid) {
        const taskStore = useTask();
        const res = taskStore.addTask({
          title: form.name,
          time: setDateByHoursAndMinutes(form.time),
        });
        if (res) {
          _visible.value = false;
        } else {
          ElMessage.error("存在同名的任务");
        }
      }
    });
  };
  const closeDialog = (ruleForm: FormInstance | undefined) => {
    if (!ruleForm) return;
    ruleForm.clearValidate();
  };
</script>
<style lang="less">
  .task-add-dialog {
    min-width: 600px;
    border-radius: 8px;
    .task-dialog-title {
      font-size: 12px;
      font-weight: 600;
      color: #67c23a;
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
