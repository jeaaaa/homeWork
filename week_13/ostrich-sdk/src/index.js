import { monitorPerformance, measure } from "./performance";
import { monitorError } from "./error";

let ostrichMonitor = {
  /**
   * 监听页面性能
   * @param {*} options
   * {
   *    pageId：页面标示,
   *    projectId: 项目ID,
   *    url：上报地址,
   *    isPage：是否上报页面性能数据,
   *    isResource：是否上报页面资源数据
   * }
   */
  startPerformanceMonitor(options) {
    monitorPerformance(options);
  },

  measure,

  /**
   * 监听页面错误
   * @param {*} options
   * {
   *    pageId：页面标示,
   *    projectId: 项目ID,
   *    url：上报地址,
   *    capture：是否截图,
   *    extendsInfo： {} 附加数据
   * }
   */
  startErrorMonitor(options) {
    monitorError(options);
  },
};

window.ostrichMonitor = ostrichMonitor;
export { ostrichMonitor };
