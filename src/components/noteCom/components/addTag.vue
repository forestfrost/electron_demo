<template>
  <el-drawer v-model="_visible" custom-class="add-tag-drawer" direction="btt" :with-header="false">
    <div class="header">
      <p class="title">标签</p>
      <el-icon size="12" @click="_visible = false" style="cursor: pointer">
        <close></close>
      </el-icon>
    </div>
    <div class="container">
      <el-tag class="tag-item" v-for="item in tagList" :type="item.status">{{ item.name }}</el-tag>
      <el-button class="tag-item" v-show="!showForm" size="small" plain @click="showForm = true">
        <el-icon>
          <plus></plus>
        </el-icon>
      </el-button>
    </div>
    <template #footer>
      <el-form :model="form" ref="Form" :rules="rules" label-width="0px" inline>
        <el-form-item prop="name" :class="['time-1', 'form', showForm ? 'form-normal' : '']">
          <el-input v-model="form.name" placeholder="请输入名称" clearable></el-input>
        </el-form-item>
        <el-form-item :class="['time-2', 'form', showForm ? 'form-normal' : '']">
          <el-select v-model="form.status" placeholder="请选择" clearable>
            <el-option
              v-for="item in statusList"
              :label="item.label"
              :value="item.value"
            ></el-option
          ></el-select>
        </el-form-item>
        <el-form-item :class="['time-3', 'form', showForm ? 'form-normal' : '']">
          <el-button circle size="small" plain type="success" @click="submit">
            <el-icon>
              <check />
            </el-icon>
          </el-button>
          <el-button circle size="small" plain type="danger" @click="showForm = false">
            <el-icon>
              <close />
            </el-icon>
          </el-button>
        </el-form-item>
      </el-form>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
  import { MyTagItem } from "@/store/types/note";
  import { useNote } from "@/store/models/note";
  import { formatDate } from "@/utils/common";
  import { Ref, WritableComputedRef } from "vue";
  import { FormInstance } from "element-plus";
  const props = defineProps<{
    visible: boolean;
  }>();
  const emit = defineEmits(["update:visible"]);
  const _visible: WritableComputedRef<boolean> = computed({
    get() {
      return props.visible;
    },
    set(val) {
      emit("update:visible", val);
    },
  });
  const showForm = ref(false); // 是否展示底部输入区
  const tagList = computed(() => {
    return useNote().tagList;
  });
  const Form: Ref<FormInstance> = ref(null) as any;
  const { addTag } = useNote();
  const statusList = [
    { value: "success", label: "一般" },
    { value: "warning", label: "注意" },
    { value: "danger", label: "重点" },
  ];
  const form: MyTagItem = reactive({
    name: "",
    createTime: "",
    status: "success",
  });
  const rules = {
    name: [{ required: true, message: "请输入名称", trigger: "change" }],
  };
  const submit = () => {
    Form.value.validate((valid) => {
      if (valid) {
        addTag({
          ...form,
          createTime: formatDate(new Date(), "YYYY-MM-DD HH:mm:ss"),
        });
      }
    });
  };
</script>
<style lang="less">
  .add-tag-drawer {
    min-height: 200px;
    height: auto;
    .header {
      display: flex;
      justify-content: space-between;
    }
    .title {
      font-size: 13px;
      font-weight: 600;
      color: #67c23a;
    }
    .time-1 {
      transition: 0.4s;
    }
    .time-2 {
      transition: 0.6s;
    }
    .time-3 {
      transition: 0.8s;
    }
    .form {
      transform: translateY(100px);
    }
    .form-normal {
      transform: translateY(0px);
    }
    .container {
      display: flex;
      padding: 6px 0;
      .tag-item {
        margin: 3px 6px;
      }
    }
  }
</style>
