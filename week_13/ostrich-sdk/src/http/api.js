/**
 * 数据持久化
 */
class API {
  constructor(url) {
    this.url = url;
  }

  /**
   * 上报信息 （默认方式）
   */
  report(data) {
    if (!this.checkUrl(this.url)) {
      console.log("上报信息url地址格式不正确,url=", this.url);
      return;
    }
    // 尽量不影响页面主线程
    if (window.requestIdleCallback) {
      window.requestIdleCallback(() => {
        this.sendInfo(data);
      });
    } else {
      this.sendInfo(data);
    }
  }

  /**
   * 发送消息
   */
  sendInfo(data) {
    try {
      if (!navigator.sendBeacon) {
        const headers = {
          type: "application/json",
        };
        const blob = new window.Blob([JSON.stringify(data)], headers);
        navigator.sendBeacon(this.url, blob);
        // navigator.sendBeacon(this.url, JSON.stringify(data));
      } else if ("fetch" in window) {
        fetch(this.url, {
          method: "POST",
          body: JSON.stringify(data),
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          headers: {
            "content-type": "application/json",
            connection: "keep-alive",
          },
          mode: "cors", // no-cors, cors, *same-origin
        });
      }
      // var xhr = new XMLHttpRequest()
      // xhr.open("POST", this.url, true)
      // //xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
      // xhr.setRequestHeader("Content-Type", "application/json")
      // xhr.send(JSON.stringify(data))
    } catch (error) {
      console.log("发送消息出错：", error);
    }
  }

  /**
   * 通过img方式上报信息
   */
  reportByImg(data) {
    if (!this.checkUrl(this.url)) {
      console.log("上报信息url地址格式不正确,url=", this.url);
      return;
    }
    try {
      var img = new Image();
      img.src = `${his.url}?v=${new Date().getTime()}&'${this.formatParams(
        data
      )}`;
    } catch (error) {
      console.log("发送消息出错：", error);
    }
  }

  /*
   *格式化参数
   */
  formatParams(data) {
    var arr = [];
    for (var name in data) {
      arr.push(`${encodeURIComponent(name)}=${encodeURIComponent(data[name])}`);
    }
    return arr.join("&");
  }

  /**
   * 检测URL
   */
  checkUrl(url) {
    if (!url) {
      return false;
    }
    var urlRule = /^[hH][tT][tT][pP]([sS]?):\/\//;
    return urlRule.test(url);
  }
}
export default API;
