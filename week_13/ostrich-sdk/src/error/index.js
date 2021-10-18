import AjaxError from "./ajaxError.js";
import ConsoleError from "./consoleError.js";
import JsError from "./jsError.js";
import PromiseError from "./promiseError.js";
import ResourceError from "./resourceError.js";
import FrameError from "./framesError.js";
import VueError from "./vueError.js";
import CaptureClick from "../utils/captureClick.js";
import utils from "../utils/utils.js";
import { AjaxLibEnum } from "../utils/config.js";

export function monitorError(options) {
  options = options || {};
  let jsError = options.jsError || true;
  let frameError = options.frameError || true;
  let promiseError = options.promiseError || true;
  let resourceError = options.resourceError || true;
  let ajaxError = options.ajaxError || true;
  let consoleError = options.consoleError || false;
  let vueError = options.vueError || false;
  let reportUrl = options.url || null; // 上报错误地址
  let extendsInfo = options.extendsInfo || {}; //扩展信息（一般用于系统个性化分析）
  let param = {
    reportUrl,
    extendsInfo,
    type: "error",
    pageId: options.pageId,
    pageUrl: location.href,
    projectId: options.projectId || 0,
  };

  let capture = {
    captureClick: true,
    captureMode: 2,
    captureReportNum: 10,
  };
  if (options.capture && utils.isString(options.capture)) {
    capture.captureClick = options.capture;
  } else if (options.capture) {
    capture = options.capture;
  }
  let newCaptureClick = new CaptureClick(capture);
  newCaptureClick.initCaptureClick();

  if (jsError) {
    new JsError(param, newCaptureClick).handleError();
  }
  if (frameError) {
    new FrameError(param).handleError();
  }
  if (promiseError) {
    new PromiseError(param).handleError();
  }
  if (resourceError) {
    new ResourceError(param).handleError();
  }
  if (ajaxError) {
    new AjaxError(param).handleError(AjaxLibEnum.DEFAULT);
  }
  if (consoleError) {
    new ConsoleError(param).handleError();
  }
  if (vueError && options.vue) {
    new VueError(param).handleError(options.vue);
  }
}
