<template>
  <el-drawer v-model="_visible" custom-class="note-add-drawer" size="100%" :with-header="false">
    <p class="title"> {{ title }} </p>
    <el-form :rules="rules" :model="ruleForm" ref="Form" inline :label-width="50">
      <el-form-item label="标题" prop="title">
        <el-input v-model="ruleForm.title" clearable placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="标签">
        <el-select
          v-model="ruleForm.tags"
          multiple
          :multiple-limit="3"
          reserve-keyword
          collapse-tags
          filterable
          clearable
        >
          <el-option
            v-for="item in noteStore.tagList"
            :label="item.name"
            :value="item.name"
            :key="item.name"
          ></el-option
        ></el-select>
      </el-form-item>
      <el-form-item label="置顶">
        <el-switch v-model="ruleForm.important" size="small" active-color="#67c23a" />
      </el-form-item>
    </el-form>
    <div class="container" ref="con"></div>
    <div class="tags-block">
      <el-tag
        class="tag"
        v-for="item in ruleForm.tags"
        :type="(noteStore.tagList.find(item2=>item2.name ==item)?.status as any)"
        size="small"
        >{{ item }}</el-tag
      >
    </div>
    <template #footer>
      <el-button type="success" size="small" @click="save()">保存</el-button>
      <el-button size="small" plain @click="_visible = false">返回</el-button>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
  import { MyNoteItem } from "@/store/types/note";
  import { useNote } from "@/store/models/note";
  import { formatDate } from "@/utils/common";
  import { Ref, WritableComputedRef } from "vue";
  import Edit from "wangeditor";
  import { ElMessage, FormInstance } from "element-plus";
  const props = defineProps<{
    visible: boolean;
    note?: MyNoteItem;
    type: string;
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
  const title = computed(() => {
    return props.type == "add" ? "创建日志录" : "编辑日志录";
  });

  const con: Ref<Element> = ref(null) as any;
  let instance: Edit;
  onMounted(() => {
    nextTick(() => {
      instance = new Edit(con.value);
      instance.config.height = 400;
      instance.config.placeholder = "每一天都有值得记录的东西...";
      instance.create();
      getNoteDetail();
    });
  });
  onBeforeUnmount(() => {
    instance.destroy();
  });

  const ruleForm: {
    tags: Array<string>;
    [propname: string]: any;
  } = reactive({
    title: "",
    tags: [],
    important: false,
  });
  const rules = {
    title: [{ required: true, message: "请输入标题", trigger: "change" }],
  };
  const Form: Ref<FormInstance> = ref(null) as any;
  const noteStore = useNote();
  const save = () => {
    Form.value.validate((valid) => {
      if (valid) {
        let note: MyNoteItem;
        let { title, tags, important } = ruleForm;
        let tagTemp = noteStore.tagList.filter((item) => tags.includes(item.name));
        const content = instance.txt.html() as string;
        note = {
          title,
          time: formatDate(new Date(), "YYYY-MM-DD HH:mm:ss"),
          status: important ? "important" : "normal",
          tags: tagTemp as any,
          content,
        };
        if (props.type == "add") {
          const res = noteStore.addNote(note);
          if (!res) {
            ElMessage.error("该标题已使用过啦");
            return;
          }
        } else {
          const res = noteStore.addNote(note, false);
          if (!res) {
            ElMessage.error("该日志录已经找不到了");
            return;
          }
        }
        _visible.value = false;
      }
    });
  };
  const getNoteDetail = () => {
    if (props.type !== "add" && props.note) {
      const { title, status, tags, content } = props.note;
      ruleForm.title = title;
      ruleForm.tags = tags.map((item) => item.name);
      ruleForm.important = status == "important";
      instance.txt.html(content);
    }
  };
</script>
<style lang="less">
  .note-add-drawer {
    .title {
      margin: 12px 0;
      font-size: 13px;
      font-weight: bold;
      text-align: center;
      color: #67c23a;
    }
    .tags-block {
      margin: 12px 0;
      .tag {
        margin: 0 6px;
      }
    }
    .el-drawer__body {
      &::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }
      &::-webkit-scrollbar-track {
        background-color: #f2f6fc;
        border-radius: 12px;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 12px;
        width: 6px;
        height: 6px;
        background-color: #529b2e;
      }
    }
  }
</style>
