import { iconPath } from "./utils/config";
import { Notification } from "electron";
export function showNotification(title: string, body?: string, subtitle?: string) {
  new Notification({
    title,
    body,
    subtitle,
    icon: iconPath,
    silent: false,
  }).show();
}
