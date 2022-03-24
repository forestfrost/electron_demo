import { resolve } from "path";
//是否为开发环境
export const isDevelopment = process.env.NODE_ENV !== "production";
//图片地址
export const iconPath = resolve(process.env.VUE_APP_ICON_PATH as string);
//贴边隐藏的补充宽\长度
export const Bert = 6;
//vueDevTools插件地址
export const extensionPath = process.env.VUE_APP_EXTENSION_PATH;
