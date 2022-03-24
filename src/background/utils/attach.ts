import { BrowserWindow, screen } from "electron";
import { Bert } from "./config";
export let windowStatus: "show" | "hide:top" | "hide:left" | "hide:right" = "show";
export function attach(window: BrowserWindow) {
  //获取当前窗口左上角的位置坐标
  const [x, y] = window.getPosition();
  const { width, height } = window.getBounds();
  const { width: clientWidth, height: clientHeight } = screen.getPrimaryDisplay().bounds;
  let distance;
  if (windowStatus === "show") {
    if (y <= 5 && !window.isFullScreen()) {
      distance = y + height - Bert;
      aninateForHideOrShow("top", distance, window);
    } else if (x <= 5) {
      distance = x + width - Bert;
      aninateForHideOrShow("left", distance, window);
    } else if (x > clientWidth - width - 5) {
      distance = clientWidth - x - Bert;
      aninateForHideOrShow("right", distance, window);
    }
  } else if (windowStatus === "hide:left") {
    distance = width - Bert;
    aninateForHideOrShow("right-show", distance, window);
  } else if (windowStatus === "hide:right") {
    distance = width - Bert;
    aninateForHideOrShow("left-show", distance, window);
  } else {
    distance = height - Bert;
    aninateForHideOrShow("bottom", distance, window);
  }
}
export function aninateForHideOrShow(
  direction: "top" | "bottom" | "left" | "right" | "left-show" | "right-show",
  distance: number,
  win: BrowserWindow,
) {
  let [x, y] = win.getPosition();
  let timer: NodeJS.Timer;
  const distancePerFrame = 100;
  switch (direction) {
    case "top":
      timer = setInterval(() => {
        if (distance > distancePerFrame) {
          win.setPosition(x, y - distancePerFrame);
          distance -= distancePerFrame;
          y -= distancePerFrame;
          if (distance == 0) {
            windowStatus = "hide:top";
          }
        } else {
          win.setPosition(x, y - distance);
          clearInterval(timer);
          windowStatus = "hide:top";
        }
      }, 16);

      break;
    case "right":
    case "right-show":
      timer = setInterval(() => {
        if (distance > distancePerFrame) {
          win.setPosition(x + distancePerFrame, y);
          distance -= distancePerFrame;
          x += distancePerFrame;
          if (distance == 0) {
            windowStatus = direction == "right" ? "hide:right" : "show";
          }
        } else {
          win.setPosition(x + distance, y);
          clearInterval(timer);
          windowStatus = direction == "right" ? "hide:right" : "show";
        }
      }, 16);
      break;
    case "bottom":
      timer = setInterval(() => {
        if (distance > distancePerFrame) {
          win.setPosition(x, y + distancePerFrame);
          distance -= distancePerFrame;
          y += distancePerFrame;
          if (distance == 0) {
            windowStatus = "show";
          }
        } else {
          win.setPosition(x, y + distance);
          clearInterval(timer);
          windowStatus = "show";
        }
      }, 16);
      break;
    case "left":
    case "left-show":
      timer = setInterval(() => {
        if (distance > distancePerFrame) {
          win.setPosition(x - distancePerFrame, y);
          distance -= distancePerFrame;
          x -= distancePerFrame;
          if (distance == 0) {
            windowStatus = direction == "left" ? "hide:left" : "show";
          }
        } else {
          win.setPosition(x - distance, y);
          clearInterval(timer);
          windowStatus = direction == "left" ? "hide:left" : "show";
        }
      }, 16);
      break;
  }
}

//设置窗口的边缘贴附
export function attachHide(window: BrowserWindow, cb: Function) {
  window.addListener("moved", () => {
    cb(window);
  });
}
export function cancelAttachHide(window: BrowserWindow, cb: Function) {
  window.removeListener("moved", cb);
}
