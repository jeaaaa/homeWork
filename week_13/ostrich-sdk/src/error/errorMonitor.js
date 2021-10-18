import report from "../report";

export default class ErrorMonitor {
  constructor(options = {}) {
    this.options = options;
    this.xhr = new XMLHttpRequest();
    this.xhr.send = XMLHttpRequest.prototype.send;
    this.xhr.open = XMLHttpRequest.prototype.open;
    this.monitorResult = {};
    this.init();
  }

  /**
   * 初始化控件
   */
  init() {
    /**
     * 监听普通Error抛出
     */
    const rewriteWindowOnerror = () => {
      const oldWindowOnerror = window.onerror;
      window.onerror = (message, src, line, column, error) => {
        oldWindowOnerror && oldWindowOnerror(message, src, line, column, error);
        const onerrorMonitorResult = {
          type: "Error",
          message,
          src,
          line,
          column,
          error,
        };
        this.addResult("error", onerrorMonitorResult);
        return true;
      };
    };

    /**
     * 监听资源加载错误
     */
    const resourceErrorMonitor = () => {
      window.addEventListener(
        "error",
        (e) => {
          if (e.target === window) {
            return;
          }
          const errorObject = e.target;
          if (errorObject.src) {
            this.xhr.open("HEAD", errorObject.src);
            this.xhr.send();
            this.xhr.onload = (response) => {
              const resourceErrorMonitorResult = {
                type: "ResourceError",
                outerHTML: errorObject.outerHTML,
                src: errorObject.src,
                status: response.target.status,
                response: response.target.responseText,
              };
              this.addResult("resourceError", resourceErrorMonitorResult);
            };
          }
          return false;
        },
        true
      );
    };

    /**
     * 监听Promise Error
     */
    const promiseErrorMonitor = () => {
      window.addEventListener("unhandledrejection", (error) => {
        const unhandledrejectionError = {
          type: "Unhandledrejection",
          message: error.reason,
        };
        this.addResult("unhandledrejection", unhandledrejectionError);
      });
    };

    /**
     * 监听AJAX Error
     */
    const ajaxErrorMonitor = () => {
      fetchErrorMonitor();
      xmlHttpErrorMonitor();
    };

    /**
     * Fetch Error
     */
    const fetchErrorMonitor = () => {
      if ("fetch" in window && typeof window.fetch === "function") {
        const originFetch = window.fetch;
        const _this = this;
        window.fetch = function (input, options) {
          return originFetch.apply(this, arguments).then((res) => {
            if (!res.ok) {
              originFetch(input, options)
                .then((res) => res.text())
                .then((response) => {
                  const fetchErrorResult = {
                    type: "FetchError",
                    src: res.url,
                    status: res.status,
                    method: (options && options.method) || "GET",
                    response,
                  };
                  _this.addResult("ajax", fetchErrorResult);
                });
            }
            return res;
          });
        };
      }
    };

    /**
     * XMLHttpRequest Error
     */
    const xmlHttpErrorMonitor = () => {
      const originXhrOpen = XMLHttpRequest.prototype.open;
      const originXhrSend = XMLHttpRequest.prototype.send;
      const addResult = this.addResult.bind(this);
      let XMLMethod = "GET";
      XMLHttpRequest.prototype.open = function (method, url) {
        XMLMethod = method;
        originXhrOpen.apply(this, arguments);
      };
      XMLHttpRequest.prototype.send = function (data) {
        const _this = this;
        originXhrSend.call(_this, data);
        const oldOnReadyStateChange = _this.onreadystatechange;
        _this.onreadystatechange = function () {
          if (_this.readyState === 4 && !/20[1-9]/.test(_this.status)) {
            const xmlHttpError = {
              type: "XMLHttpRequestError",
              src: _this.responseURL,
              method: XMLMethod,
              status: _this.status,
              response: _this.responseText,
            };
            addResult("ajax", xmlHttpError);
          }
          oldOnReadyStateChange &&
            oldOnReadyStateChange.apply(_this, arguments);
        };
      };
    };

    /**
     * 通过重写document.createElement自动为script添加crossOrigin
     */
    const crossOriginScriptErrorMonitor = () => {
      document.createElement = (function () {
        const fn = document.createElement.bind(document);
        return function (type) {
          const result = fn(type);
          if (type === "script") {
            result.crossOrigin = "anonymous";
          }
          return result;
        };
      })();
    };

    /**
     * 处理Vue错误提示
     */
    const vuehandleError = () => {
      if (!Vue) {
        return;
      }

      Vue.config.errorHandler = (error, vm, info) => {
        let metaData = {
          message: error.message,
          stack: error.stack,
          info: info,
        };
        if (Object.prototype.toString.call(vm) === "[object Object]") {
          metaData.componentName = vm._isVue
            ? vm.$options.name || vm.$options._componentTag
            : vm.name;
          metaData.propsData = vm.$options.propsData;
        }
        let err = {
          msg: JSON.stringify(metaData),
        };
        addResult("vue", err);
      };
    };

    /**
     * 上报数据
     */
    rewriteWindowOnerror();
    resourceErrorMonitor();
    promiseErrorMonitor();
    ajaxErrorMonitor();
    crossOriginScriptErrorMonitor();
    vuehandleError();
  }

  /**
   * 添加捕获的错误结果
   * @param {String} type 错误类型
   * @param {Object} result 错误结果对象
   */
  addResult(type, result = {}) {
    result.time = new Date().getTime();
    result.url = window.location.href;
    if (this.monitorResult[type]) {
      this.monitorResult[type].push(result);
    } else {
      this.monitorResult[type] = [result];
    }
    report(this.options.url, {
      type: "error",
      data: this.monitorResult,
    });
    this.monitorResult = {};
  }
}
