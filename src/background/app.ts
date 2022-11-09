import { app, BrowserWindow, session } from "electron";
import { showNotification } from "./notification";
import { isDevelopment, extensionPath } from "./utils/config";
import { createWindow } from "./window";
import { resolve, basename } from "path";

export const setApp = () => {
  const exeName = basename(process.execPath);
  app.setLoginItemSettings({
    openAsHidden: false,
    path: process.execPath,
    args: ["--processStart", `"${exeName}"`],
  });
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
  app.on("ready", async () => {
    createWindow(true);
  });
  if (isDevelopment) {
    if (process.platform === "win32") {
      process.on("message", (data) => {
        if (data === "graceful-exit") {
          app.quit();
        }
      });
    } else {
      process.on("SIGTERM", () => {
        app.quit();
      });
    }
    app.whenReady().then(async () => {
      session.defaultSession.loadExtension(resolve(extensionPath as string));
      showNotification("提示", "工作台已经启动啦");
    });
  }
};
