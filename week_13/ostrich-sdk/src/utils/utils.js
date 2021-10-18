import FingerprintJS from "@fingerprintjs/fingerprintjs";

let _ = {};
["Function", "String", "Object", "Number", "Boolean", "Arguments"].forEach(
  (name) => {
    _["is" + name] = function (obj) {
      return toString.call(obj) === "[object " + name + "]";
    };
  }
);

export default {
  ..._,

  type(obj) {
    return Object.prototype.toString.call(obj).replace(/\[object\s|\]/g, "");
  },

  /**
   * 是否为null
   * @param {String} str
   */
  isNull(str) {
    return str == undefined || str == "" || str == null;
  },

  /**
   * 对象是否为空
   * @param {*} obj
   */
  objectIsNull(obj) {
    return JSON.stringify(obj) === "{}";
  },

  /**
   * 生成随机数
   */
  randomString(len) {
    len = len || 10;
    const $chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz123456789";
    const maxPos = $chars.length;
    let pwd = "";
    for (let i = 0; i < len; i++) {
      pwd = pwd + $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd + new Date().getTime();
  },

  /**
   * 获得markpage
   */
  markUser() {
    let psMarkUser = sessionStorage.getItem("ps_markUser") || "";
    if (!psMarkUser) {
      psMarkUser = this.randomString();
      sessionStorage.setItem("ps_markUser", psMarkUser);
    }
    return psMarkUser;
  },

  /**
   * 获得Uv
   */
  async markUv() {
    if (localStorage) {
      let uid = localStorage.getItem("__OSTRICH_UID__");
      if (uid) {
        return uid;
      } else {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        localStorage.setItem("__OSTRICH_UID__", result.visitorId);
        return result.visitorId;
      }
    }
  },
};
