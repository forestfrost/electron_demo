import { Ref, watch } from "vue";
export const watchComOpen = (comOpen: Ref<boolean>, conClass: Ref<string>) => {
  watch(comOpen, (val) => {
    if (val) {
      conClass.value = "open";
    } else {
      conClass.value = "close";
    }
  });
};
