/**
 * @description element icons全局注册
 */
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Plus,
  Check,
  Close,
} from "@element-plus/icons-vue";

const components = [ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Plus, Check, Close];

export default {
  install(app: any) {
    components.forEach((comp) => {
      app.component(comp.name, comp);
    });
  },
};
