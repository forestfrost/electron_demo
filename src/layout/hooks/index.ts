import { sendMouseStatus } from "@/utils/useIPC";
import { ref } from "vue";
export const useMouse = () => {
  const status = ref("LEAVE");
  const mouseEnter = () => {
    if (status.value === "ENTER") return;
    status.value = "ENTER";
    sendMouseStatus("ENTER");
  };
  const mouseLeave = (event: any) => {
    if (status.value == "LEAVE") return;
    status.value = "LEAVE";
    sendMouseStatus("LEAVE", {
      screenX: event.screenX,
      screenY: event.screenY,
      clientY: event.clientY,
    });
  };
  return {
    mouseEnter,
    mouseLeave,
  };
};
