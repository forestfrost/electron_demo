import { Ref, onMounted } from "vue";
import { throttle } from "@/utils/common";
const showBottom = (container: Ref<Element>, isBottom: Ref<boolean>) => {
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
const useBottom = (container: Ref<Element>, isBottom: Ref<boolean>) => {
  onMounted(() => {
    showBottom(container, isBottom);
    const cb = () => {
      container.value.scrollTop + container.value.clientHeight <= container.value.scrollHeight - 10
        ? (isBottom.value = true)
        : (isBottom.value = false);
    };
    container.value.addEventListener("scroll", throttle(cb, 150));
  });
};
export { useBottom, showBottom, scrollThreeRow };
