import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./style/index.less";
import ElementIcons from "@/plugin/elementIcons";
import 'element-plus/dist/index.css'
createApp(App).use(router).use(store).use(ElementIcons).mount("#app");
