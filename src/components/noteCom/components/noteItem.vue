<template>
  <div class="note-item flex-space-between" @mouseenter="enter" @mouseleave="leave">
    <div class="lt">
      <div class="title">
        <el-icon v-if="noteItem.status === 'lock'" color="red" class="icon">
          <lock />
        </el-icon>
        <el-icon v-if="noteItem.status === 'important'" color="red" class="icon">
          <arrow-up />
        </el-icon>
        <span>{{ noteItem.title }}</span>
        <el-tag
          class="tag"
          :type="(item.status as any)"
          plain
          size="small"
          v-for="item in noteItem.tags"
          >{{ item.name }}</el-tag
        >
      </div>
      <div>
        <el-icon class="icon">
          <clock />
        </el-icon>
        <span>{{ noteItem.time }}</span>
      </div></div
    >
    <div class="rt" :style="{ opacity: opacity }">
      <el-button size="small" circle type="success" @click="handleCheckNote">
        <el-icon>
          <reading></reading>
        </el-icon>
      </el-button>
      <template v-if="noteItem.status !== 'lock'">
        <el-button size="small" circle type="primary" @click="handleEditNote">
          <template #icon>
            <el-icon>
              <edit />
            </el-icon>
          </template>
        </el-button>
        <el-button size="small" circle type="danger" @click="handleOperteNote('deleted')">
          <template #icon>
            <el-icon>
              <delete />
            </el-icon>
          </template>
        </el-button>
        <el-button
          v-if="noteItem.status !== 'important'"
          size="small"
          circle
          type="danger"
          @click="handleOperteNote('lock')"
        >
          <template #icon>
            <el-icon>
              <lock />
            </el-icon>
          </template>
        </el-button>
      </template>

      <el-button v-else size="small" circle type="success" @click="handleOperteNote('normal')">
        <template #icon>
          <el-icon>
            <key />
          </el-icon>
        </template>
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { MyNoteItem } from "@/store/types/note";
  const props = defineProps<{
    note: MyNoteItem;
  }>();
  const emit = defineEmits(["handleOperteNote", "editNote", "checkNote"]);
  const noteItem = computed(() => {
    return props.note;
  });
  const handleCheckNote = () => {
    emit("checkNote", noteItem.value);
  };
  const handleOperteNote = (status: "lock" | "normal" | "deleted" | "important") => {
    emit("handleOperteNote", { ...noteItem.value, status });
  };
  const handleEditNote = () => {
    emit("editNote", noteItem.value);
  };

  const opacity = ref(0);
  const enter = () => {
    opacity.value = 1;
  };
  const leave = () => {
    opacity.value = 0;
  };
</script>
<style lang="less" scoped>
  .note-item {
    box-sizing: border-box;
    padding-top: 10px;
    width: 100%;
    height: 50px;
    color: gray;
    &:hover {
      box-shadow: 0 1px rgb(0 0 0 / 10%);
    }
    .tag {
      margin: 0 3px;
    }
    .icon {
      top: 2px;
      margin-right: 3px;
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
