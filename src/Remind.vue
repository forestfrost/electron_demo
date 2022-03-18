<template>
  <div class="remind-app">
    <span class="header"> {{ remindMsg.title }}的时间到啦! </span>
    <el-icon class="alarm" :size="50" color="white">
      <alarm-clock></alarm-clock>
    </el-icon>
    <p class="word">
      {{ wordList[index2] }}
    </p>
  </div>
  <div
    class="background"
    :style="{
      backgroundImage: `url(./${imgList[index]})`,
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      'background-size': 'cover',
    }"
  >
  </div>
</template>

<script lang="ts" setup>
  import { setRemindMsg } from "@/utils/useIPC";
  import { Ref } from "vue";
  import { MyTaskItem } from "./store/types/task";
  const remindMsg = setRemindMsg() as Ref<MyTaskItem>;
  const index = Math.floor(Math.random() * 2);
  const index2 = Math.floor(Math.random() * 4);
  const imgList = ["background_3.jpg", "background_2.png"];
  const wordList = [
    "时代潮流总是由少数人带领的",
    "人生而自由，却无往不在枷锁中",
    "事亲以敬，美过三牲",
    "人的归属在自己心中",
  ];
</script>
<style>
  @keyframes animate {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.5);
    }
    100% {
      transform: scale(1);
    }
  }
</style>
<style scoped>
  .remind-app {
    overflow: hidden;
    padding: 20px;
    height: 340px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    background-color: #303133;
  }
  .remind-app .header {
    font-size: 20px;
    text-align: center;
    font-weight: 600;
    color: #f2f6fc;
  }
  .remind-app .word {
    font-size: 13px;
    font-weight: 600;
    text-align: center;
    color: #f2f6fc;
  }
  .remind-app .alarm {
    margin: 0 auto;
    animation-name: animate;
    animation-timing-function: linear;
    animation-duration: 5s;
    animation-iteration-count: infinite;
  }
  .background {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    filter: blur(3px) opacity(0.5);
  }
</style>
