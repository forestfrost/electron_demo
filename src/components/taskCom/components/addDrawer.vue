<template>
  <el-drawer
    v-model="_visible"
    :with-header="false"
    custom-class="add-task-drawer h-300"
    direction="btt"
  >
    <div class="header">
      <p class="title">
        {{ title }}
      </p>
      <el-button size="small" type="info" plain circle @click="_visible = false">
        <el-icon>
          <close></close>
        </el-icon>
      </el-button>
    </div>
    <el-form :model="ruleForm" :rules="rules" ref="Form" label-width="50px" inline>
      <el-form-item prop="title" label="名称">
        <el-input
          v-model.trim="ruleForm.title"
          type="text"
          clearable
          placeholder="请输入"
          maxlength="10"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item prop="time" label="时间">
        <el-time-picker v-model="ruleForm.time" placeholder="请选择" />
      </el-form-item>
      <el-form-item label="重复">
        <el-select v-model="ruleForm.cycleRule" placeholder="请选择" @change="handleSelectTime">
          <el-option v-for="item in options" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="remark" label="备注" class="special-form-item-for-add-task-remark">
        <el-input v-model="ruleForm.remark" type="text" placeholder="请输入" clearable></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submit(Form)" type="success" size="small">确认</el-button>
      <el-button @click="_visible = false" size="small" plain>返回</el-button>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
  import { useTask } from "@/store/models/task";
  import { MyTaskItem } from "@/store/types/task";
  import { Before, formatDate } from "@/utils/common";
  import { ElMessage, FormInstance } from "element-plus";
  import { Ref } from "vue";

  const props = defineProps<{
    visible: boolean;
    type: string;
    taskDetail?: MyTaskItem;
  }>();
  const emit = defineEmits(["update:visible"]);
  const _visible = computed({
    get() {
      return props.visible;
    },
    set(val: boolean) {
      emit("update:visible", val);
    },
  });
  const title = computed(() => {
    const title: Record<string, string> = {
      check: "查看任务",
      add: "新建任务",
      edit: "编辑任务",
    };
    return title[props.type];
  });
  const getNow = () => {
    let now = new Date();
    now.setMinutes(now.getMinutes() + 5);
    return now;
  };

  const ruleForm: MyTaskItem = reactive({
    title: "",
    time: getNow(),
    cycle: false,
    remark: "",
    cycleRule: "",
    cycleType: "",
  });
  const resetForm = () => {
    handleSelectTime("");
    ruleForm.remark = "";
    ruleForm.time = getNow();
  };
  let selectedTime = computed(() => {
    return {
      second: ruleForm.time.getSeconds(),
      minute: ruleForm.time.getMinutes(),
      hour: ruleForm.time.getHours(),
      dayOfWeek: ruleForm.time.getDay(),
      day: ruleForm.time.getDate(),
      month: ruleForm.time.getMonth() + 1,
    };
  });
  let options = [
    { label: "一次性任务", value: "" },
    {
      label: "每天",
      value: `${selectedTime.value.second} ${selectedTime.value.minute} ${selectedTime.value.hour} * * *`,
    },
    {
      label: "每周一至周五",
      value: `${selectedTime.value.second} ${selectedTime.value.minute} ${selectedTime.value.hour} * * 1-5`,
    },
    {
      label: "每周",
      value: `${selectedTime.value.second} ${selectedTime.value.minute} ${selectedTime.value.hour} * * ${selectedTime.value.dayOfWeek}`,
    },
    {
      label: "每月",
      value: `${selectedTime.value.second} ${selectedTime.value.minute} ${selectedTime.value.hour} ${selectedTime.value.day} * *`,
    },
  ];
  const handleSelectTime = (val: string) => {
    if (val === "") {
      ruleForm.cycle = false;
      ruleForm.cycleType = "";
    } else {
      const option = options.find((item) => item.value === val);
      ruleForm.cycle = true;
      ruleForm.cycleType = option?.label;
    }
  };
  const checkTime = (rule: any, value: string, cb: any) => {
    if (Before(value, new Date())) {
      return cb(new Error("选择时间已经过去啦"));
    }
    cb();
  };
  const rules = {
    title: [
      {
        required: true,
        message: "请输入任务名称",
        trigger: "change",
      },
    ],
    time: [
      { required: true, message: "请选择时间", trigger: "change" },
      {
        validator: checkTime,
        trigger: "change",
      },
    ],
    remark: [
      {
        max: 20,
        message: "最多20个字符",
        trigger: "change",
      },
    ],
  };
  const Form: Ref<FormInstance> = ref(null) as any;

  const submit = (FormTemp: FormInstance | undefined) => {
    if (!FormTemp) return;
    FormTemp.validate((valid) => {
      if (valid) {
        const taskStore = useTask();
        const res = taskStore.addTask({
          title: ruleForm.title,
          time: ruleForm.time,
          remark: ruleForm.remark,
          cycle: ruleForm.cycle,
          cycleRule: ruleForm.cycleRule,
          cycleType: ruleForm.cycleType,
        });
        if (res) {
          resetForm();
          _visible.value = false;
        } else {
          ElMessage.error("存在同名的任务");
        }
      }
    });
  };
  watch(_visible, (val) => {
    if (!val) {
      resetForm();
    }
  });
</script>
<style lang="less">
  .add-task-drawer {
    .header {
      display: flex;
      justify-content: space-between;
      .title {
        font-size: 12px;
        font-weight: 600;
        color: #67c23a;
      }
    }
    .el-input {
      width: 180px;
    }
    .special-form-item-for-add-task-remark {
      .el-input {
        width: 440px !important;
      }
    }
  }
  .add-task-drawer.h-300 {
    height: 300px !important;
  }
  .add-task-drawer.h-200 {
    height: 200px !important;
  }
</style>
