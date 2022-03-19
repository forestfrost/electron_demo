import { ref, Ref, onMounted } from "vue";
import { throttle } from "@/utils/common";
let isBottom = ref(false);
const showBottom = (container: Ref<Element>) => {
  if (!container.value) return;
  if (container.value.scrollHeight > container.value.clientHeight) {
    isBottom.value = true;
  } else {
    isBottom.value = false;
  }
};
const scrollThreeRow = (container: Element) => {
  container.scrollTo({ top: container.scrollTop + 150, behavior: "smooth" });
};
const useBottom = (container: Ref<Element>) => {
  onMounted(() => {
    showBottom(container);
    container.value.addEventListener(
      "scroll",
      throttle(() => {
        container.value.scrollTop + container.value.clientHeight <=
        container.value.scrollHeight - 10
          ? (isBottom.value = true)
          : (isBottom.value = false);
      }, 150),
    );
  });
  return {
    isBottom,
  };
};
export { useBottom, showBottom, scrollThreeRow };
