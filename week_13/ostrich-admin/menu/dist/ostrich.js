var Ostrich = (function (exports) {
  "use strict";

  // 页面性能监控
  let ttiTime = {}; // FP FCP longtask容器
  // FP FCP

  const observerPaint = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      ttiTime[entry.name] = entry.startTime + entry.duration; // startTime启动时间 duration 执行时间
    }
  });
  observerPaint.observe({
    entryTypes: ["paint"],
  }); // longtask
  // 长任务建议在空闲时执行 requestIdleCallback+webwork
  // 耗时较长的任务阻塞主线程(超过50ms)

  const observerLongTask = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      ttiTime[entry.name] = entry.startTime + entry.duration;
    }
  });
  observerLongTask.observe({
    entryTypes: ["longtask"],
  });
  /**
   * 获取时间
   */

  function getTiming() {
    try {
      if (!window.performance || !window.performance.timing) {
        console.log("你的浏览器不支持 performance 操作");
        return;
      }

      const { timing } = window.performance;
      let times = {};
      const loadTime = timing.loadEventEnd - timing.loadEventStart;

      if (loadTime < 0) {
        setTimeout(() => {
          getTiming();
        }, 200);
        return;
      } // 网络建立连接
      // 上一个页面卸载总耗时

      times.prevPage = timing.fetchStart - timing.navigationStart; // 上一个页面卸载

      times.prevUnload = timing.unloadEventEnd - timing.unloadEventStart; //【重要】重定向的时间

      times.redirectTime = timing.redirectEnd - timing.redirectStart; // DNS 缓存时间

      times.appcacheTime = timing.domainLookupStart - timing.fetchStart; //【重要】DNS 查询时间
      //【原因】DNS 预加载做了么？页面内是不是使用了太多不同的域名导致域名查询的时间太长？

      times.dnsTime = timing.domainLookupEnd - timing.domainLookupStart; //【重要】读取页面第一个字节的时间
      //【原因】这可以理解为用户拿到你的资源占用的时间，加异地机房了么，加CDN 处理了么？加带宽了么？加 CPU 运算速度了么？

      times.ttfbTime = timing.responseStart - timing.navigationStart; // tcp连接耗时

      times.tcpTime = timing.connectEnd - timing.connectStart; // 网络总耗时

      times.network = timing.connectEnd - timing.navigationStart; // 网络接收数据
      // 前端从发送请求到接收请求的时间

      times.send = timing.responseStart - timing.requestStart; // 接收数据用时
      //【原因】页面内容经过 gzip 压缩了么，静态资源 css/js 等压缩了么？

      times.receive = timing.responseEnd - timing.responseStart; // 请求页面总耗时

      times.request = timing.responseEnd - timing.requestStart; // 前端渲染
      // 解析dom树耗时

      times.analysisTime = timing.domComplete - timing.domInteractive; // timing.domLoading
      //【重要】执行 onload 回调函数的时间
      //【原因】是否太多不必要的操作都放到 onload 回调函数里执行了，考虑过延迟加载、按需加载的策略么？

      times.onload = timing.loadEventEnd - timing.loadEventStart; // 前端总时间

      times.frontend = timing.loadEventEnd - timing.domLoading; // 白屏时间

      times.blankTime = timing.domLoading - timing.navigationStart; // domReadyTime(dom准备时间)

      times.domReadyTime =
        timing.domContentLoadedEventEnd - timing.navigationStart; //【重要】页面加载完成的时间
      //【原因】这几乎代表了用户等待页面可用的时间

      times.loadPage = timing.loadEventEnd - timing.navigationStart; // 可操作时间

      times.domIteractive = timing.domInteractive - timing.navigationStart;
      const perfEntries = performance.getEntriesByType("mark");

      for (const entry of perfEntries) {
        ttiTime[entry.name] = entry.startTime + entry.duration;
        performance.clearMarks(entry.name);
      }

      return Object.assign(times, ttiTime);
    } catch (e) {
      console.log("获取performance出错:", e);
    }
  }
  /**
   * 资源加载时间
   */

  function getEntries() {
    if (!window.performance || !window.performance.getEntries) {
      console.log("该浏览器不支持performance.getEntries方法");
      return;
    }

    let entryTimesList = [];
    let entryList = window.performance.getEntries();

    if (!entryList || entryList.length == 0) {
      return entryTimesList;
    }

    entryList.forEach((item) => {
      let templeObj = {};
      let usefulType = [
        "script",
        "css",
        "fetch",
        "xmlhttprequest",
        "link",
        "img",
      ]; // 'navigation'

      if (usefulType.indexOf(item.initiatorType) > -1) {
        // 请求资源路径
        templeObj.name = item.name; // 发起资源类型

        templeObj.initiatorType = item.initiatorType; // http协议版本

        templeObj.nextHopProtocol = item.nextHopProtocol; // dns查询耗时

        templeObj.dnsTime = item.domainLookupEnd - item.domainLookupStart; // tcp链接耗时

        templeObj.tcpTime = item.connectEnd - item.connectStart; // 请求时间

        templeObj.reqTime = item.responseEnd - item.responseStart; // 重定向时间

        templeObj.redirectTime = item.redirectEnd - item.redirectStart;
        entryTimesList.push(templeObj);
      }
    });
    return entryTimesList;
  }

  function clearPerformance() {
    if (window.performance && window.performance.clearResourceTimings) {
      performance.clearResourceTimings();
    }
  }
  /**
   * 获取函数运行时常
   */

  function measure(fn) {
    // const startName = prefixStart(name)
    // const endName = prefixEnd(name)
    // performance.mark(startName)
    const t0 = performance.now(); // await fn()

    fn();
    const t1 = performance.now(); // performance.mark(endName)
    // 调用 measure
    // performance.measure(name, startName, endName)
    // const [{
    //     duration
    // }] = performance.getEntriesByName(name)
    // performance.clearMarks(`${MARK_START}${name}`)
    // performance.clearMarks(`${MARK_END}${name}`)
    // performance.clearMeasures(name)

    return t1 - t0;
  }
  // const t0 = performance.now()
  // for (let i = 0; i < array.length; i++) {
  //      some code
  // }
  // const t1 = performance.now()
  // console.log(t1 - t0, 'milliseconds')
  // console.time('test')
  // console.time('test')
  // for (let i = 0; i < array.length; i++) {
  //   // some code
  // }
  // console.timeEnd('test')

  const uaMathList = [
    {
      name: "iphone",
      matchList: [/iPhone/i],
    },
    {
      name: "华为",
      matchList: [
        /HUAWEI/i,
        /SPN-AL00/i,
        /GLK-AL00/i,
        /Huawei/i,
        /HMSCore/i,
        /HW/,
      ],
    },
    {
      name: "荣耀",
      matchList: [/HONOR/i],
    },
    {
      name: "oppo",
      matchList: [
        /PCAM10/i,
        /OPPO/i,
        /PCH/,
        /PBAM00/,
        /PBEM00/,
        /HeyTapBrowser/,
        /PADT00/,
        /PCDM10/,
      ],
    },
    {
      name: "vivo",
      matchList: [/V1981A/i, /vivo/i, /V1818A/, /V1838A/, /V19/, /VivoBrowser/],
    },
    {
      name: "小米",
      matchList: [/Redmi/i, /HM/, /MIX/i, /MI/, /XiaoMi/],
    },
    {
      name: "金利",
      matchList: [/GN708T/i],
    },
    {
      name: "oneplus",
      matchList: [/GM1910/i, /ONEPLUS/i],
    },
    {
      name: "sony",
      matchList: [/SOV/i, /LT29i/, /Xperia/],
    },
    {
      name: "三星",
      matchList: [/SAMSUNG/i, /SM-/, /GT/, /SCH-I939I/],
    },
    {
      name: "魅族",
      matchList: [/MZ-/, /MX4/i, /M355/, /M353/, /M351/, /M811/, /PRO 7-H/],
    },
    {
      name: "华硕",
      matchList: [/ASUS/],
    },
    {
      name: "美图",
      matchList: [/MP/],
    },
    {
      name: "天语",
      matchList: [/K-Touch/],
    },
    {
      name: "联想",
      matchList: [/Lenovo/i],
    },
    {
      name: "宇飞来",
      matchList: [/YU FLY/i],
    },
    {
      name: "糖果",
      matchList: [/SUGAR/i],
    },
    {
      name: "酷派",
      matchList: [/Coolpad/i],
    },
    {
      name: "ecell",
      matchList: [/ecell/i],
    },
    {
      name: "詹姆士",
      matchList: [/A99A/i],
    },
    {
      name: "tcl",
      matchList: [/TCL/i],
    },
    {
      name: "捷语",
      matchList: [/6000/i, /V1813A/],
    },
    {
      name: "8848",
      matchList: [/8848/i],
    },
    {
      name: "H6",
      matchList: [/H6/],
    },
    {
      name: "中兴",
      matchList: [/ZTE/i],
    },
    {
      name: "努比亚",
      matchList: [/NX/],
    },
    {
      name: "努比亚",
      matchList: [/NX/],
    },
    {
      name: "海信",
      matchList: [/HS/],
    },
    {
      name: "HTC",
      matchList: [/HTC/],
    },
  ];
  let BrandUa = {
    getBrand: function (ua) {
      for (let i = 0; i < uaMathList.length; i++) {
        let uaDetail = uaMathList[i];

        for (let j = 0; j < uaDetail.matchList.length; j++) {
          let re = uaDetail.matchList[j];

          if (re.test(ua)) {
            return uaDetail.name;
          }
        }
      }

      let brandMatch = /; ([^;]+) Build/.exec(ua);

      if (brandMatch) {
        return brandMatch[1];
      } else {
        return false;
      }
    },
  };

  let DeviceInfo = (function () {
    const root = typeof self !== "undefined" ? self : this;

    const _window = root || {}; // 变量库

    let VariableLibrary = {
      navigator: typeof root.navigator != "undefined" ? root.navigator : {},
      // 信息map
      infoMap: {
        engine: ["WebKit", "Trident", "Gecko", "Presto"],
        // 引擎
        browser: [
          // 浏览器
          "Safari",
          "Chrome",
          "Edge",
          "IE",
          "Firefox",
          "Firefox Focus",
          "Chromium",
          "Opera",
          "Vivaldi",
          "Yandex",
          "Arora",
          "Lunascape",
          "QupZilla",
          "Coc Coc",
          "Kindle",
          "Iceweasel",
          "Konqueror",
          "Iceape",
          "SeaMonkey",
          "Epiphany",
          "360",
          "360SE",
          "360EE",
          "UC",
          "QQBrowser",
          "QQ",
          "Baidu",
          "Maxthon",
          "Sogou",
          "LBBROWSER",
          "2345Explorer",
          "TheWorld",
          "XiaoMi",
          "Quark",
          "Qiyu",
          "Wechat",
          "Taobao",
          "Alipay",
          "Weibo",
          "Douban",
          "Suning",
          "iQiYi",
        ],
        os: [
          // 系统
          "Windows",
          "Linux",
          "Mac OS",
          "Android",
          "Ubuntu",
          "FreeBSD",
          "Debian",
          "iOS",
          "Windows Phone",
          "BlackBerry",
          "MeeGo",
          "Symbian",
          "Chrome OS",
          "WebOS",
        ],
        device: ["Mobile", "Tablet", "iPad"], // 设备
      },
    }; // 方法库

    let MethodLibrary = (function () {
      return {
        // 获取匹配库
        getMatchMap: function (u) {
          return {
            // 内核
            Trident: u.indexOf("Trident") > -1 || u.indexOf("NET CLR") > -1,
            Presto: u.indexOf("Presto") > -1,
            WebKit: u.indexOf("AppleWebKit") > -1,
            Gecko: u.indexOf("Gecko/") > -1,
            // 浏览器
            Safari: u.indexOf("Safari") > -1,
            Chrome: u.indexOf("Chrome") > -1 || u.indexOf("CriOS") > -1,
            IE: u.indexOf("MSIE") > -1 || u.indexOf("Trident") > -1,
            Edge: u.indexOf("Edge") > -1,
            Firefox: u.indexOf("Firefox") > -1 || u.indexOf("FxiOS") > -1,
            "Firefox Focus": u.indexOf("Focus") > -1,
            Chromium: u.indexOf("Chromium") > -1,
            Opera: u.indexOf("Opera") > -1 || u.indexOf("OPR") > -1,
            Vivaldi: u.indexOf("Vivaldi") > -1,
            Yandex: u.indexOf("YaBrowser") > -1,
            Arora: u.indexOf("Arora") > -1,
            Lunascape: u.indexOf("Lunascape") > -1,
            QupZilla: u.indexOf("QupZilla") > -1,
            "Coc Coc": u.indexOf("coc_coc_browser") > -1,
            Kindle: u.indexOf("Kindle") > -1 || u.indexOf("Silk/") > -1,
            Iceweasel: u.indexOf("Iceweasel") > -1,
            Konqueror: u.indexOf("Konqueror") > -1,
            Iceape: u.indexOf("Iceape") > -1,
            SeaMonkey: u.indexOf("SeaMonkey") > -1,
            Epiphany: u.indexOf("Epiphany") > -1,
            360: u.indexOf("QihooBrowser") > -1 || u.indexOf("QHBrowser") > -1,
            "360EE": u.indexOf("360EE") > -1,
            "360SE": u.indexOf("360SE") > -1,
            UC: u.indexOf("UC") > -1 || u.indexOf(" UBrowser") > -1,
            QQBrowser: u.indexOf("QQBrowser") > -1,
            QQ: u.indexOf("QQ/") > -1,
            Baidu: u.indexOf("Baidu") > -1 || u.indexOf("BIDUBrowser") > -1,
            Maxthon: u.indexOf("Maxthon") > -1,
            Sogou: u.indexOf("MetaSr") > -1 || u.indexOf("Sogou") > -1,
            LBBROWSER: u.indexOf("LBBROWSER") > -1,
            "2345Explorer": u.indexOf("2345Explorer") > -1,
            TheWorld: u.indexOf("TheWorld") > -1,
            XiaoMi: u.indexOf("MiuiBrowser") > -1,
            Quark: u.indexOf("Quark") > -1,
            Qiyu: u.indexOf("Qiyu") > -1,
            Wechat: u.indexOf("MicroMessenger") > -1,
            Taobao: u.indexOf("AliApp(TB") > -1,
            Alipay: u.indexOf("AliApp(AP") > -1,
            Weibo: u.indexOf("Weibo") > -1,
            Douban: u.indexOf("com.douban.frodo") > -1,
            Suning: u.indexOf("SNEBUY-APP") > -1,
            iQiYi: u.indexOf("IqiyiApp") > -1,
            // 系统或平台
            Windows: u.indexOf("Windows") > -1,
            Linux: u.indexOf("Linux") > -1 || u.indexOf("X11") > -1,
            "Mac OS": u.indexOf("Macintosh") > -1,
            Android: u.indexOf("Android") > -1 || u.indexOf("Adr") > -1,
            Ubuntu: u.indexOf("Ubuntu") > -1,
            FreeBSD: u.indexOf("FreeBSD") > -1,
            Debian: u.indexOf("Debian") > -1,
            "Windows Phone":
              u.indexOf("IEMobile") > -1 || u.indexOf("Windows Phone") > -1,
            BlackBerry: u.indexOf("BlackBerry") > -1 || u.indexOf("RIM") > -1,
            MeeGo: u.indexOf("MeeGo") > -1,
            Symbian: u.indexOf("Symbian") > -1,
            iOS: u.indexOf("like Mac OS X") > -1,
            "Chrome OS": u.indexOf("CrOS") > -1,
            WebOS: u.indexOf("hpwOS") > -1,
            // 设备
            Mobile:
              u.indexOf("Mobi") > -1 ||
              u.indexOf("iPh") > -1 ||
              u.indexOf("480") > -1,
            Tablet: u.indexOf("Tablet") > -1 || u.indexOf("Nexus 7") > -1,
            iPad: u.indexOf("iPad") > -1,
          };
        },
        // 在信息map和匹配库中进行匹配
        matchInfoMap: function (_self) {
          let u = VariableLibrary.navigator.userAgent || {};
          let match = MethodLibrary.getMatchMap(u);

          for (let s in VariableLibrary.infoMap) {
            for (let i = 0; i < VariableLibrary.infoMap[s].length; i++) {
              let value = VariableLibrary.infoMap[s][i];

              if (match[value]) {
                _self[s] = value;
              }
            }
          }
        },
        // 获取当前操作系统
        getOS: function () {
          let _self = this;

          MethodLibrary.matchInfoMap(_self);
          return _self.os;
        },
        // 获取操作系统版本
        getOSVersion: function () {
          let _self = this;

          let u = VariableLibrary.navigator.userAgent || {};
          _self.osVersion = ""; // 系统版本信息

          let osVersion = {
            Windows: function () {
              let v = u.replace(/^.*Windows NT ([\d.]+);.*$/, "$1");
              let oldWindowsVersionMap = {
                6.4: "10",
                6.3: "8.1",
                6.2: "8",
                6.1: "7",
                "6.0": "Vista",
                5.2: "XP",
                5.1: "XP",
                "5.0": "2000",
              };
              return oldWindowsVersionMap[v] || v;
            },
            Android: function () {
              return u.replace(/^.*Android ([\d.]+);.*$/, "$1");
            },
            iOS: function () {
              return u
                .replace(/^.*OS ([\d_]+) like.*$/, "$1")
                .replace(/_/g, ".");
            },
            Debian: function () {
              return u.replace(/^.*Debian\/([\d.]+).*$/, "$1");
            },
            "Windows Phone": function () {
              return u.replace(/^.*Windows Phone( OS)? ([\d.]+);.*$/, "$2");
            },
            "Mac OS": function () {
              return u
                .replace(/^.*Mac OS X ([\d_]+).*$/, "$1")
                .replace(/_/g, ".");
            },
            WebOS: function () {
              return u.replace(/^.*hpwOS\/([\d.]+);.*$/, "$1");
            },
          };

          if (osVersion[_self.os]) {
            _self.osVersion = osVersion[_self.os]();

            if (_self.osVersion == u) {
              _self.osVersion = "";
            }
          }

          return _self.osVersion;
        },
        // 获取横竖屏状态
        getOrientationStatu: function () {
          let orientationStatus = "";
          let orientation = window.matchMedia("(orientation: portrait)");

          if (orientation.matches) {
            orientationStatus = "竖屏";
          } else {
            orientationStatus = "横屏";
          }

          return orientationStatus;
        },
        // 获取设备类型
        getDeviceType: function () {
          let _self = this;

          _self.device = "PC";
          MethodLibrary.matchInfoMap(_self);
          return _self.device;
        },
        // 获取网络状态
        getNetwork: function () {
          let netWork =
            navigator &&
            navigator.connection &&
            navigator.connection.effectiveType;
          return netWork;
        },
        // 获取当前语言
        getLanguage: function () {
          let _self = this;

          _self.language = (function () {
            let language =
              VariableLibrary.navigator.browserLanguage ||
              VariableLibrary.navigator.language;
            let arr = language.split("-");

            if (arr[1]) {
              arr[1] = arr[1].toUpperCase();
            }

            return arr.join("_");
          })();

          return _self.language;
        },
        //获取品牌
        getBrand: function () {
          let u = VariableLibrary.navigator.userAgent || {};
          return BrandUa.getBrand(u);
        },
        // 生成浏览器指纹
        createFingerprint: function (domain) {
          let fingerprint;

          function bin2hex(s) {
            let i,
              l,
              n,
              o = "";
            s += "";

            for (i = 0, l = s.length; i < l; i++) {
              n = s.charCodeAt(i).toString(16);
              o += n.length < 2 ? "0" + n : n;
            }

            return o;
          }

          let canvas = document.createElement("canvas");
          let ctx = canvas.getContext("2d");
          let txt = domain || window.location.host;
          ctx.textBaseline = "top";
          ctx.font = "14px 'Arial'";
          ctx.textBaseline = "tencent";
          ctx.fillStyle = "#f60";
          ctx.fillRect(125, 1, 62, 20);
          ctx.fillStyle = "#069";
          ctx.fillText(txt, 2, 15);
          ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
          ctx.fillText(txt, 4, 17);
          let b64 = canvas.toDataURL().replace("data:image/png;base64,", "");
          let bin = atob(b64);
          let crc = bin2hex(bin.slice(-16, -12));
          fingerprint = crc;
          return fingerprint;
        },
        // 浏览器信息
        getBrowserInfo: function () {
          let _self = this;

          MethodLibrary.matchInfoMap(_self);
          let u = VariableLibrary.navigator.userAgent || {};

          let _mime = function (option, value) {
            let mimeTypes = VariableLibrary.navigator.mimeTypes;

            for (let key in mimeTypes) {
              if (mimeTypes[key][option] == value) {
                return true;
              }
            }

            return false;
          };

          let match = MethodLibrary.getMatchMap(u);
          let is360 = false;

          if (_window.chrome) {
            let chrome_vision = u.replace(/^.*Chrome\/([\d]+).*$/, "$1");

            if (chrome_vision > 36 && _window.showModalDialog) {
              is360 = true;
            } else if (chrome_vision > 45) {
              is360 = _mime("type", "application/vnd.chromium.remoting-viewer");
            }
          }

          if (match["Baidu"] && match["Opera"]) {
            match["Baidu"] = false;
          }

          if (match["Mobile"]) {
            match["Mobile"] = !(u.indexOf("iPad") > -1);
          }

          if (is360) {
            if (_mime("type", "application/gameplugin")) {
              match["360SE"] = true;
            } else if (
              VariableLibrary.navigator &&
              typeof VariableLibrary.navigator["connection"]["saveData"] ==
                "undefined"
            ) {
              match["360SE"] = true;
            } else {
              match["360EE"] = true;
            }
          }

          if (match["IE"] || match["Edge"]) {
            let navigator_top = window.screenTop - window.screenY;

            switch (navigator_top) {
              case 71:
                // 无收藏栏,贴边
                break;

              case 74:
                // 无收藏栏,非贴边
                break;

              case 99:
                // 有收藏栏,贴边
                break;

              case 102:
                // 有收藏栏,非贴边
                match["360EE"] = true;
                break;

              case 75:
                // 无收藏栏,贴边
                break;

              case 74:
                // 无收藏栏,非贴边
                break;

              case 105:
                // 有收藏栏,贴边
                break;

              case 104:
                // 有收藏栏,非贴边
                match["360SE"] = true;
                break;
            }
          }

          let browerVersionMap = {
            Safari: function () {
              return u.replace(/^.*Version\/([\d.]+).*$/, "$1");
            },
            Chrome: function () {
              return u
                .replace(/^.*Chrome\/([\d.]+).*$/, "$1")
                .replace(/^.*CriOS\/([\d.]+).*$/, "$1");
            },
            IE: function () {
              return u
                .replace(/^.*MSIE ([\d.]+).*$/, "$1")
                .replace(/^.*rv:([\d.]+).*$/, "$1");
            },
            Edge: function () {
              return u.replace(/^.*Edge\/([\d.]+).*$/, "$1");
            },
            Firefox: function () {
              return u
                .replace(/^.*Firefox\/([\d.]+).*$/, "$1")
                .replace(/^.*FxiOS\/([\d.]+).*$/, "$1");
            },
            "Firefox Focus": function () {
              return u.replace(/^.*Focus\/([\d.]+).*$/, "$1");
            },
            Chromium: function () {
              return u.replace(/^.*Chromium\/([\d.]+).*$/, "$1");
            },
            Opera: function () {
              return u
                .replace(/^.*Opera\/([\d.]+).*$/, "$1")
                .replace(/^.*OPR\/([\d.]+).*$/, "$1");
            },
            Vivaldi: function () {
              return u.replace(/^.*Vivaldi\/([\d.]+).*$/, "$1");
            },
            Yandex: function () {
              return u.replace(/^.*YaBrowser\/([\d.]+).*$/, "$1");
            },
            Arora: function () {
              return u.replace(/^.*Arora\/([\d.]+).*$/, "$1");
            },
            Lunascape: function () {
              return u.replace(/^.*Lunascape[\/\s]([\d.]+).*$/, "$1");
            },
            QupZilla: function () {
              return u.replace(/^.*QupZilla[\/\s]([\d.]+).*$/, "$1");
            },
            "Coc Coc": function () {
              return u.replace(/^.*coc_coc_browser\/([\d.]+).*$/, "$1");
            },
            Kindle: function () {
              return u.replace(/^.*Version\/([\d.]+).*$/, "$1");
            },
            Iceweasel: function () {
              return u.replace(/^.*Iceweasel\/([\d.]+).*$/, "$1");
            },
            Konqueror: function () {
              return u.replace(/^.*Konqueror\/([\d.]+).*$/, "$1");
            },
            Iceape: function () {
              return u.replace(/^.*Iceape\/([\d.]+).*$/, "$1");
            },
            SeaMonkey: function () {
              return u.replace(/^.*SeaMonkey\/([\d.]+).*$/, "$1");
            },
            Epiphany: function () {
              return u.replace(/^.*Epiphany\/([\d.]+).*$/, "$1");
            },
            360: function () {
              return u.replace(/^.*QihooBrowser\/([\d.]+).*$/, "$1");
            },
            "360SE": function () {
              let hash = {
                63: "10.0",
                55: "9.1",
                45: "8.1",
                42: "8.0",
                31: "7.0",
                21: "6.3",
              };
              let chrome_vision = u.replace(/^.*Chrome\/([\d]+).*$/, "$1");
              return hash[chrome_vision] || "";
            },
            "360EE": function () {
              let hash = {
                69: "11.0",
                63: "9.5",
                55: "9.0",
                50: "8.7",
                30: "7.5",
              };
              let chrome_vision = u.replace(/^.*Chrome\/([\d]+).*$/, "$1");
              return hash[chrome_vision] || "";
            },
            Maxthon: function () {
              return u.replace(/^.*Maxthon\/([\d.]+).*$/, "$1");
            },
            QQBrowser: function () {
              return u.replace(/^.*QQBrowser\/([\d.]+).*$/, "$1");
            },
            QQ: function () {
              return u.replace(/^.*QQ\/([\d.]+).*$/, "$1");
            },
            Baidu: function () {
              return u.replace(/^.*BIDUBrowser[\s\/]([\d.]+).*$/, "$1");
            },
            UC: function () {
              return u.replace(/^.*UC?Browser\/([\d.]+).*$/, "$1");
            },
            Sogou: function () {
              return u
                .replace(/^.*SE ([\d.X]+).*$/, "$1")
                .replace(/^.*SogouMobileBrowser\/([\d.]+).*$/, "$1");
            },
            LBBROWSER: function () {
              let hash = {
                57: "6.5",
                49: "6.0",
                46: "5.9",
                42: "5.3",
                39: "5.2",
                34: "5.0",
                29: "4.5",
                21: "4.0",
              };
              let chrome_vision = navigator.userAgent.replace(
                /^.*Chrome\/([\d]+).*$/,
                "$1"
              );
              return hash[chrome_vision] || "";
            },
            "2345Explorer": function () {
              return u.replace(/^.*2345Explorer\/([\d.]+).*$/, "$1");
            },
            TheWorld: function () {
              return u.replace(/^.*TheWorld ([\d.]+).*$/, "$1");
            },
            XiaoMi: function () {
              return u.replace(/^.*MiuiBrowser\/([\d.]+).*$/, "$1");
            },
            Quark: function () {
              return u.replace(/^.*Quark\/([\d.]+).*$/, "$1");
            },
            Qiyu: function () {
              return u.replace(/^.*Qiyu\/([\d.]+).*$/, "$1");
            },
            Wechat: function () {
              return u.replace(/^.*MicroMessenger\/([\d.]+).*$/, "$1");
            },
            Taobao: function () {
              return u.replace(/^.*AliApp\(TB\/([\d.]+).*$/, "$1");
            },
            Alipay: function () {
              return u.replace(/^.*AliApp\(AP\/([\d.]+).*$/, "$1");
            },
            Weibo: function () {
              return u.replace(/^.*weibo__([\d.]+).*$/, "$1");
            },
            Douban: function () {
              return u.replace(/^.*com.douban.frodo\/([\d.]+).*$/, "$1");
            },
            Suning: function () {
              return u.replace(/^.*SNEBUY-APP([\d.]+).*$/, "$1");
            },
            iQiYi: function () {
              return u.replace(/^.*IqiyiVersion\/([\d.]+).*$/, "$1");
            },
          };
          _self.browserVersion = "";

          if (browerVersionMap[_self.browser]) {
            _self.browserVersion = browerVersionMap[_self.browser]();

            if (_self.browserVersion == u) {
              _self.browserVersion = "";
            }
          }

          if (_self.browser == "Edge") {
            _self.engine = "EdgeHTML";
          }

          if (
            _self.browser == "Chrome" &&
            parseInt(_self.browserVersion) > 27
          ) {
            _self.engine = "Blink";
          }

          if (_self.browser == "Opera" && parseInt(_self.browserVersion) > 12) {
            _self.engine = "Blink";
          }

          if (_self.browser == "Yandex") {
            _self.engine = "Blink";
          }

          return (
            _self.browser +
            "（版本: " +
            _self.browserVersion +
            "&nbsp;&nbsp;内核: " +
            _self.engine +
            "）"
          );
        },
      };
    })(); // 逻辑层

    let LogicLibrary = (function () {
      return {
        DeviceInfoObj: function (params) {
          params = params || {
            domain: "",
          };
          let info = {
            deviceType: MethodLibrary.getDeviceType(),
            // 设备类型
            OS: MethodLibrary.getOS(),
            // 操作系统
            OSVersion: MethodLibrary.getOSVersion(),
            // 操作系统版本
            screenHeight: _window.screen.height,
            // 屏幕高
            screenWidth: _window.screen.width,
            // 屏幕宽
            language: MethodLibrary.getLanguage(),
            // 当前使用的语言-国家
            netWork: MethodLibrary.getNetwork(),
            // 联网类型
            orientation: MethodLibrary.getOrientationStatu(),
            // 横竖屏
            browserInfo: MethodLibrary.getBrowserInfo(),
            // 浏览器信息
            mobileBrand: MethodLibrary.getBrand(),
            //移动设备品牌信息
            fingerprint: MethodLibrary.createFingerprint(params.domain),
            // 浏览器指纹
            userAgent: VariableLibrary.navigator.userAgent, // 包含 appCodeName,appName,appVersion,language,platform 等
          };

          if (!params.info || params.info.length == 0) {
            return info;
          }

          let infoTemp = {};

          for (let i in info) {
            params.info.forEach(function (item) {
              if (item.toLowerCase() == i.toLowerCase()) {
                item = i;
                infoTemp[item] = info[item];
              }
            });
          }

          return infoTemp;
        },
      };
    })(); // 对外暴露方法

    return {
      getDeviceInfo: function (params) {
        return LogicLibrary.DeviceInfoObj(params);
      },
    };
  })();

  var commonjsGlobal =
    typeof globalThis !== "undefined"
      ? globalThis
      : typeof window !== "undefined"
      ? window
      : typeof global !== "undefined"
      ? global
      : typeof self !== "undefined"
      ? self
      : {};

  function createCommonjsModule(fn, module) {
    return (
      (module = { exports: {} }), fn(module, module.exports), module.exports
    );
  }

  var ttiPolyfill = createCommonjsModule(function (module) {
    (function () {
      var h =
          "undefined" != typeof window && window === this
            ? this
            : "undefined" != typeof commonjsGlobal && null != commonjsGlobal
            ? commonjsGlobal
            : this,
        k =
          "function" == typeof Object.defineProperties
            ? Object.defineProperty
            : function (a, b, c) {
                a != Array.prototype &&
                  a != Object.prototype &&
                  (a[b] = c.value);
              };
      function l() {
        l = function () {};
        h.Symbol || (h.Symbol = m);
      }
      var n = 0;
      function m(a) {
        return "jscomp_symbol_" + (a || "") + n++;
      }
      function p() {
        l();
        var a = h.Symbol.iterator;
        a || (a = h.Symbol.iterator = h.Symbol("iterator"));
        "function" != typeof Array.prototype[a] &&
          k(Array.prototype, a, {
            configurable: !0,
            writable: !0,
            value: function () {
              return q(this);
            },
          });
        p = function () {};
      }
      function q(a) {
        var b = 0;
        return r(function () {
          return b < a.length ? { done: !1, value: a[b++] } : { done: !0 };
        });
      }
      function r(a) {
        p();
        a = { next: a };
        a[h.Symbol.iterator] = function () {
          return this;
        };
        return a;
      }
      function t(a) {
        p();
        var b = a[Symbol.iterator];
        return b ? b.call(a) : q(a);
      }
      function u(a) {
        if (!(a instanceof Array)) {
          a = t(a);
          for (var b, c = []; !(b = a.next()).done; ) c.push(b.value);
          a = c;
        }
        return a;
      }
      var v = 0;
      function w(a, b) {
        var c = XMLHttpRequest.prototype.send,
          d = v++;
        XMLHttpRequest.prototype.send = function (f) {
          for (var e = [], g = 0; g < arguments.length; ++g)
            e[g - 0] = arguments[g];
          var E = this;
          a(d);
          this.addEventListener("readystatechange", function () {
            4 === E.readyState && b(d);
          });
          return c.apply(this, e);
        };
      }
      function x(a, b) {
        var c = fetch;
        fetch = function (d) {
          for (var f = [], e = 0; e < arguments.length; ++e)
            f[e - 0] = arguments[e];
          return new Promise(function (d, e) {
            var g = v++;
            a(g);
            c.apply(null, [].concat(u(f))).then(
              function (a) {
                b(g);
                d(a);
              },
              function (a) {
                b(a);
                e(a);
              }
            );
          });
        };
      }
      var y = "img script iframe link audio video source".split(" ");
      function z(a, b) {
        a = t(a);
        for (var c = a.next(); !c.done; c = a.next())
          if (
            ((c = c.value),
            b.includes(c.nodeName.toLowerCase()) || z(c.children, b))
          )
            return !0;
        return !1;
      }
      function A(a) {
        var b = new MutationObserver(function (c) {
          c = t(c);
          for (var b = c.next(); !b.done; b = c.next())
            (b = b.value),
              "childList" == b.type && z(b.addedNodes, y)
                ? a(b)
                : "attributes" == b.type &&
                  y.includes(b.target.tagName.toLowerCase()) &&
                  a(b);
        });
        b.observe(document, {
          attributes: !0,
          childList: !0,
          subtree: !0,
          attributeFilter: ["href", "src"],
        });
        return b;
      }
      function B(a, b) {
        if (2 < a.length) return performance.now();
        var c = [];
        b = t(b);
        for (var d = b.next(); !d.done; d = b.next())
          (d = d.value),
            c.push({ timestamp: d.start, type: "requestStart" }),
            c.push({ timestamp: d.end, type: "requestEnd" });
        b = t(a);
        for (d = b.next(); !d.done; d = b.next())
          c.push({ timestamp: d.value, type: "requestStart" });
        c.sort(function (a, b) {
          return a.timestamp - b.timestamp;
        });
        a = a.length;
        for (b = c.length - 1; 0 <= b; b--)
          switch (((d = c[b]), d.type)) {
            case "requestStart":
              a--;
              break;
            case "requestEnd":
              a++;
              if (2 < a) return d.timestamp;
              break;
            default:
              throw Error("Internal Error: This should never happen");
          }
        return 0;
      }
      function C(a) {
        a = a ? a : {};
        this.w = !!a.useMutationObserver;
        this.u = a.minValue || null;
        a = window.__tti && window.__tti.e;
        var b = window.__tti && window.__tti.o;
        this.a = a
          ? a.map(function (a) {
              return { start: a.startTime, end: a.startTime + a.duration };
            })
          : [];
        b && b.disconnect();
        this.b = [];
        this.f = new Map();
        this.j = null;
        this.v = -Infinity;
        this.i = !1;
        this.h = this.c = this.s = null;
        w(this.m.bind(this), this.l.bind(this));
        x(this.m.bind(this), this.l.bind(this));
        D(this);
        this.w && (this.h = A(this.B.bind(this)));
      }
      C.prototype.getFirstConsistentlyInteractive = function () {
        var a = this;
        return new Promise(function (b) {
          a.s = b;
          "complete" == document.readyState
            ? F(a)
            : window.addEventListener("load", function () {
                F(a);
              });
        });
      };
      function F(a) {
        a.i = !0;
        var b = 0 < a.a.length ? a.a[a.a.length - 1].end : 0,
          c = B(a.g, a.b);
        G(a, Math.max(c + 5e3, b));
      }
      function G(a, b) {
        !a.i ||
          a.v > b ||
          (clearTimeout(a.j),
          (a.j = setTimeout(function () {
            var b = performance.timing.navigationStart,
              d = B(a.g, a.b),
              b =
                (window.a && window.a.A ? 1e3 * window.a.A().C - b : 0) ||
                performance.timing.domContentLoadedEventEnd - b;
            if (a.u) var f = a.u;
            else
              performance.timing.domContentLoadedEventEnd
                ? ((f = performance.timing),
                  (f = f.domContentLoadedEventEnd - f.navigationStart))
                : (f = null);
            var e = performance.now();
            null === f && G(a, Math.max(d + 5e3, e + 1e3));
            var g = a.a;
            5e3 > e - d
              ? (d = null)
              : ((d = g.length ? g[g.length - 1].end : b),
                (d = 5e3 > e - d ? null : Math.max(d, f)));
            d &&
              (a.s(d),
              clearTimeout(a.j),
              (a.i = !1),
              a.c && a.c.disconnect(),
              a.h && a.h.disconnect());
            G(a, performance.now() + 1e3);
          }, b - performance.now())),
          (a.v = b));
      }
      function D(a) {
        a.c = new PerformanceObserver(function (b) {
          b = t(b.getEntries());
          for (var c = b.next(); !c.done; c = b.next())
            if (
              ((c = c.value),
              "resource" === c.entryType &&
                (a.b.push({ start: c.fetchStart, end: c.responseEnd }),
                G(a, B(a.g, a.b) + 5e3)),
              "longtask" === c.entryType)
            ) {
              var d = c.startTime + c.duration;
              a.a.push({ start: c.startTime, end: d });
              G(a, d + 5e3);
            }
        });
        a.c.observe({ entryTypes: ["longtask", "resource"] });
      }
      C.prototype.m = function (a) {
        this.f.set(a, performance.now());
      };
      C.prototype.l = function (a) {
        this.f.delete(a);
      };
      C.prototype.B = function () {
        G(this, performance.now() + 5e3);
      };
      h.Object.defineProperties(C.prototype, {
        g: {
          configurable: !0,
          enumerable: !0,
          get: function () {
            return [].concat(u(this.f.values()));
          },
        },
      });
      var H = {
        getFirstConsistentlyInteractive: function (a) {
          a = a ? a : {};
          return "PerformanceLongTaskTiming" in window
            ? new C(a).getFirstConsistentlyInteractive()
            : Promise.resolve(null);
        },
      };
      module.exports ? (module.exports = H) : (window.ttiPolyfill = H);
    })();
  });

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
      } // 尽量不影响页面主线程

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
          navigator.sendBeacon(this.url, blob); // navigator.sendBeacon(this.url, JSON.stringify(data));
        } else if ("fetch" in window) {
          fetch(this.url, {
            method: "POST",
            body: JSON.stringify(data),
            cache: "no-cache",
            // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
              "content-type": "application/json",
              connection: "keep-alive",
            },
            mode: "cors", // no-cors, cors, *same-origin
          });
        } // var xhr = new XMLHttpRequest()
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
        arr.push(
          `${encodeURIComponent(name)}=${encodeURIComponent(data[name])}`
        );
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

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation.

  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */

  var __assign = function () {
    __assign =
      Object.assign ||
      function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };

  function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  }

  function __generator(thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                  ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  }

  /** @deprecated */
  function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++)
      s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
        r[k] = a[j];
    return r;
  }

  /**
   * FingerprintJS v3.3.0 - Copyright (c) FingerprintJS, Inc, 2021 (https://fingerprintjs.com)
   * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
   *
   * This software contains code from open-source projects:
   * MurmurHash3 by Karan Lyons (https://github.com/karanlyons/murmurHash3.js)
   */

  var version = "3.3.0";

  function wait(durationMs, resolveWith) {
    return new Promise(function (resolve) {
      return setTimeout(resolve, durationMs, resolveWith);
    });
  }
  function requestIdleCallbackIfAvailable(fallbackTimeout, deadlineTimeout) {
    if (deadlineTimeout === void 0) {
      deadlineTimeout = Infinity;
    }
    var requestIdleCallback = window.requestIdleCallback;
    if (requestIdleCallback) {
      // The function `requestIdleCallback` loses the binding to `window` here.
      // `globalThis` isn't always equal `window` (see https://github.com/fingerprintjs/fingerprintjs/issues/683).
      // Therefore, an error can occur. `call(window,` prevents the error.
      return new Promise(function (resolve) {
        return requestIdleCallback.call(
          window,
          function () {
            return resolve();
          },
          { timeout: deadlineTimeout }
        );
      });
    } else {
      return wait(Math.min(fallbackTimeout, deadlineTimeout));
    }
  }
  function isPromise(value) {
    return value && typeof value.then === "function";
  }
  /**
   * Calls a maybe asynchronous function without creating microtasks when the function is synchronous.
   * Catches errors in both cases.
   *
   * If just you run a code like this:
   * ```
   * console.time('Action duration')
   * await action()
   * console.timeEnd('Action duration')
   * ```
   * The synchronous function time can be measured incorrectly because another microtask may run before the `await`
   * returns the control back to the code.
   */
  function awaitIfAsync(action, callback) {
    try {
      var returnedValue = action();
      if (isPromise(returnedValue)) {
        returnedValue.then(
          function (result) {
            return callback(true, result);
          },
          function (error) {
            return callback(false, error);
          }
        );
      } else {
        callback(true, returnedValue);
      }
    } catch (error) {
      callback(false, error);
    }
  }
  /**
   * If you run many synchronous tasks without using this function, the JS main loop will be busy and asynchronous tasks
   * (e.g. completing a network request, rendering the page) won't be able to happen.
   * This function allows running many synchronous tasks such way that asynchronous tasks can run too in background.
   */
  function forEachWithBreaks(items, callback, loopReleaseInterval) {
    if (loopReleaseInterval === void 0) {
      loopReleaseInterval = 16;
    }
    return __awaiter(this, void 0, void 0, function () {
      var lastLoopReleaseTime, i, now;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            lastLoopReleaseTime = Date.now();
            i = 0;
            _a.label = 1;
          case 1:
            if (!(i < items.length)) return [3 /*break*/, 4];
            callback(items[i], i);
            now = Date.now();
            if (!(now >= lastLoopReleaseTime + loopReleaseInterval))
              return [3 /*break*/, 3];
            lastLoopReleaseTime = now;
            // Allows asynchronous actions and microtasks to happen
            return [4 /*yield*/, wait(0)];
          case 2:
            // Allows asynchronous actions and microtasks to happen
            _a.sent();
            _a.label = 3;
          case 3:
            ++i;
            return [3 /*break*/, 1];
          case 4:
            return [2 /*return*/];
        }
      });
    });
  }

  /*
   * Taken from https://github.com/karanlyons/murmurHash3.js/blob/a33d0723127e2e5415056c455f8aed2451ace208/murmurHash3.js
   */
  //
  // Given two 64bit ints (as an array of two 32bit ints) returns the two
  // added together as a 64bit int (as an array of two 32bit ints).
  //
  function x64Add(m, n) {
    m = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff];
    n = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff];
    var o = [0, 0, 0, 0];
    o[3] += m[3] + n[3];
    o[2] += o[3] >>> 16;
    o[3] &= 0xffff;
    o[2] += m[2] + n[2];
    o[1] += o[2] >>> 16;
    o[2] &= 0xffff;
    o[1] += m[1] + n[1];
    o[0] += o[1] >>> 16;
    o[1] &= 0xffff;
    o[0] += m[0] + n[0];
    o[0] &= 0xffff;
    return [(o[0] << 16) | o[1], (o[2] << 16) | o[3]];
  }
  //
  // Given two 64bit ints (as an array of two 32bit ints) returns the two
  // multiplied together as a 64bit int (as an array of two 32bit ints).
  //
  function x64Multiply(m, n) {
    m = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff];
    n = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff];
    var o = [0, 0, 0, 0];
    o[3] += m[3] * n[3];
    o[2] += o[3] >>> 16;
    o[3] &= 0xffff;
    o[2] += m[2] * n[3];
    o[1] += o[2] >>> 16;
    o[2] &= 0xffff;
    o[2] += m[3] * n[2];
    o[1] += o[2] >>> 16;
    o[2] &= 0xffff;
    o[1] += m[1] * n[3];
    o[0] += o[1] >>> 16;
    o[1] &= 0xffff;
    o[1] += m[2] * n[2];
    o[0] += o[1] >>> 16;
    o[1] &= 0xffff;
    o[1] += m[3] * n[1];
    o[0] += o[1] >>> 16;
    o[1] &= 0xffff;
    o[0] += m[0] * n[3] + m[1] * n[2] + m[2] * n[1] + m[3] * n[0];
    o[0] &= 0xffff;
    return [(o[0] << 16) | o[1], (o[2] << 16) | o[3]];
  }
  //
  // Given a 64bit int (as an array of two 32bit ints) and an int
  // representing a number of bit positions, returns the 64bit int (as an
  // array of two 32bit ints) rotated left by that number of positions.
  //
  function x64Rotl(m, n) {
    n %= 64;
    if (n === 32) {
      return [m[1], m[0]];
    } else if (n < 32) {
      return [
        (m[0] << n) | (m[1] >>> (32 - n)),
        (m[1] << n) | (m[0] >>> (32 - n)),
      ];
    } else {
      n -= 32;
      return [
        (m[1] << n) | (m[0] >>> (32 - n)),
        (m[0] << n) | (m[1] >>> (32 - n)),
      ];
    }
  }
  //
  // Given a 64bit int (as an array of two 32bit ints) and an int
  // representing a number of bit positions, returns the 64bit int (as an
  // array of two 32bit ints) shifted left by that number of positions.
  //
  function x64LeftShift(m, n) {
    n %= 64;
    if (n === 0) {
      return m;
    } else if (n < 32) {
      return [(m[0] << n) | (m[1] >>> (32 - n)), m[1] << n];
    } else {
      return [m[1] << (n - 32), 0];
    }
  }
  //
  // Given two 64bit ints (as an array of two 32bit ints) returns the two
  // xored together as a 64bit int (as an array of two 32bit ints).
  //
  function x64Xor(m, n) {
    return [m[0] ^ n[0], m[1] ^ n[1]];
  }
  //
  // Given a block, returns murmurHash3's final x64 mix of that block.
  // (`[0, h[0] >>> 1]` is a 33 bit unsigned right shift. This is the
  // only place where we need to right shift 64bit ints.)
  //
  function x64Fmix(h) {
    h = x64Xor(h, [0, h[0] >>> 1]);
    h = x64Multiply(h, [0xff51afd7, 0xed558ccd]);
    h = x64Xor(h, [0, h[0] >>> 1]);
    h = x64Multiply(h, [0xc4ceb9fe, 0x1a85ec53]);
    h = x64Xor(h, [0, h[0] >>> 1]);
    return h;
  }
  //
  // Given a string and an optional seed as an int, returns a 128 bit
  // hash using the x64 flavor of MurmurHash3, as an unsigned hex.
  //
  function x64hash128(key, seed) {
    key = key || "";
    seed = seed || 0;
    var remainder = key.length % 16;
    var bytes = key.length - remainder;
    var h1 = [0, seed];
    var h2 = [0, seed];
    var k1 = [0, 0];
    var k2 = [0, 0];
    var c1 = [0x87c37b91, 0x114253d5];
    var c2 = [0x4cf5ad43, 0x2745937f];
    var i;
    for (i = 0; i < bytes; i = i + 16) {
      k1 = [
        (key.charCodeAt(i + 4) & 0xff) |
          ((key.charCodeAt(i + 5) & 0xff) << 8) |
          ((key.charCodeAt(i + 6) & 0xff) << 16) |
          ((key.charCodeAt(i + 7) & 0xff) << 24),
        (key.charCodeAt(i) & 0xff) |
          ((key.charCodeAt(i + 1) & 0xff) << 8) |
          ((key.charCodeAt(i + 2) & 0xff) << 16) |
          ((key.charCodeAt(i + 3) & 0xff) << 24),
      ];
      k2 = [
        (key.charCodeAt(i + 12) & 0xff) |
          ((key.charCodeAt(i + 13) & 0xff) << 8) |
          ((key.charCodeAt(i + 14) & 0xff) << 16) |
          ((key.charCodeAt(i + 15) & 0xff) << 24),
        (key.charCodeAt(i + 8) & 0xff) |
          ((key.charCodeAt(i + 9) & 0xff) << 8) |
          ((key.charCodeAt(i + 10) & 0xff) << 16) |
          ((key.charCodeAt(i + 11) & 0xff) << 24),
      ];
      k1 = x64Multiply(k1, c1);
      k1 = x64Rotl(k1, 31);
      k1 = x64Multiply(k1, c2);
      h1 = x64Xor(h1, k1);
      h1 = x64Rotl(h1, 27);
      h1 = x64Add(h1, h2);
      h1 = x64Add(x64Multiply(h1, [0, 5]), [0, 0x52dce729]);
      k2 = x64Multiply(k2, c2);
      k2 = x64Rotl(k2, 33);
      k2 = x64Multiply(k2, c1);
      h2 = x64Xor(h2, k2);
      h2 = x64Rotl(h2, 31);
      h2 = x64Add(h2, h1);
      h2 = x64Add(x64Multiply(h2, [0, 5]), [0, 0x38495ab5]);
    }
    k1 = [0, 0];
    k2 = [0, 0];
    switch (remainder) {
      case 15:
        k2 = x64Xor(k2, x64LeftShift([0, key.charCodeAt(i + 14)], 48));
      // fallthrough
      case 14:
        k2 = x64Xor(k2, x64LeftShift([0, key.charCodeAt(i + 13)], 40));
      // fallthrough
      case 13:
        k2 = x64Xor(k2, x64LeftShift([0, key.charCodeAt(i + 12)], 32));
      // fallthrough
      case 12:
        k2 = x64Xor(k2, x64LeftShift([0, key.charCodeAt(i + 11)], 24));
      // fallthrough
      case 11:
        k2 = x64Xor(k2, x64LeftShift([0, key.charCodeAt(i + 10)], 16));
      // fallthrough
      case 10:
        k2 = x64Xor(k2, x64LeftShift([0, key.charCodeAt(i + 9)], 8));
      // fallthrough
      case 9:
        k2 = x64Xor(k2, [0, key.charCodeAt(i + 8)]);
        k2 = x64Multiply(k2, c2);
        k2 = x64Rotl(k2, 33);
        k2 = x64Multiply(k2, c1);
        h2 = x64Xor(h2, k2);
      // fallthrough
      case 8:
        k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 7)], 56));
      // fallthrough
      case 7:
        k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 6)], 48));
      // fallthrough
      case 6:
        k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 5)], 40));
      // fallthrough
      case 5:
        k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 4)], 32));
      // fallthrough
      case 4:
        k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 3)], 24));
      // fallthrough
      case 3:
        k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 2)], 16));
      // fallthrough
      case 2:
        k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 1)], 8));
      // fallthrough
      case 1:
        k1 = x64Xor(k1, [0, key.charCodeAt(i)]);
        k1 = x64Multiply(k1, c1);
        k1 = x64Rotl(k1, 31);
        k1 = x64Multiply(k1, c2);
        h1 = x64Xor(h1, k1);
      // fallthrough
    }
    h1 = x64Xor(h1, [0, key.length]);
    h2 = x64Xor(h2, [0, key.length]);
    h1 = x64Add(h1, h2);
    h2 = x64Add(h2, h1);
    h1 = x64Fmix(h1);
    h2 = x64Fmix(h2);
    h1 = x64Add(h1, h2);
    h2 = x64Add(h2, h1);
    return (
      ("00000000" + (h1[0] >>> 0).toString(16)).slice(-8) +
      ("00000000" + (h1[1] >>> 0).toString(16)).slice(-8) +
      ("00000000" + (h2[0] >>> 0).toString(16)).slice(-8) +
      ("00000000" + (h2[1] >>> 0).toString(16)).slice(-8)
    );
  }

  /**
   * Converts an error object to a plain object that can be used with `JSON.stringify`.
   * If you just run `JSON.stringify(error)`, you'll get `'{}'`.
   */
  function errorToObject(error) {
    var _a;
    return __assign(
      {
        name: error.name,
        message: error.message,
        stack:
          (_a = error.stack) === null || _a === void 0
            ? void 0
            : _a.split("\n"),
      },
      error
    );
  }

  /*
   * This file contains functions to work with pure data only (no browser features, DOM, side effects, etc).
   */
  /**
   * Does the same as Array.prototype.includes but has better typing
   */
  function includes(haystack, needle) {
    for (var i = 0, l = haystack.length; i < l; ++i) {
      if (haystack[i] === needle) {
        return true;
      }
    }
    return false;
  }
  /**
   * Like `!includes()` but with proper typing
   */
  function excludes(haystack, needle) {
    return !includes(haystack, needle);
  }
  /**
   * Be careful, NaN can return
   */
  function toInt(value) {
    return parseInt(value);
  }
  /**
   * Be careful, NaN can return
   */
  function toFloat(value) {
    return parseFloat(value);
  }
  function replaceNaN(value, replacement) {
    return typeof value === "number" && isNaN(value) ? replacement : value;
  }
  function countTruthy(values) {
    return values.reduce(function (sum, value) {
      return sum + (value ? 1 : 0);
    }, 0);
  }
  function round(value, base) {
    if (base === void 0) {
      base = 1;
    }
    if (Math.abs(base) >= 1) {
      return Math.round(value / base) * base;
    } else {
      // Sometimes when a number is multiplied by a small number, precision is lost,
      // for example 1234 * 0.0001 === 0.12340000000000001, and it's more precise divide: 1234 / (1 / 0.0001) === 0.1234.
      var counterBase = 1 / base;
      return Math.round(value * counterBase) / counterBase;
    }
  }
  /**
   * Parses a CSS selector into tag name with HTML attributes.
   * Only single element selector are supported (without operators like space, +, >, etc).
   *
   * Multiple values can be returned for each attribute. You decide how to handle them.
   */
  function parseSimpleCssSelector(selector) {
    var _a, _b;
    var errorMessage = "Unexpected syntax '" + selector + "'";
    var tagMatch = /^\s*([a-z-]*)(.*)$/i.exec(selector);
    var tag = tagMatch[1] || undefined;
    var attributes = {};
    var partsRegex = /([.:#][\w-]+|\[.+?\])/gi;
    var addAttribute = function (name, value) {
      attributes[name] = attributes[name] || [];
      attributes[name].push(value);
    };
    for (;;) {
      var match = partsRegex.exec(tagMatch[2]);
      if (!match) {
        break;
      }
      var part = match[0];
      switch (part[0]) {
        case ".":
          addAttribute("class", part.slice(1));
          break;
        case "#":
          addAttribute("id", part.slice(1));
          break;
        case "[": {
          var attributeMatch =
            /^\[([\w-]+)([~|^$*]?=("(.*?)"|([\w-]+)))?(\s+[is])?\]$/.exec(part);
          if (attributeMatch) {
            addAttribute(
              attributeMatch[1],
              (_b =
                (_a = attributeMatch[4]) !== null && _a !== void 0
                  ? _a
                  : attributeMatch[5]) !== null && _b !== void 0
                ? _b
                : ""
            );
          } else {
            throw new Error(errorMessage);
          }
          break;
        }
        default:
          throw new Error(errorMessage);
      }
    }
    return [tag, attributes];
  }

  function ensureErrorWithMessage(error) {
    return error && typeof error === "object" && "message" in error
      ? error
      : { message: error };
  }
  /**
   * Loads the given entropy source. Returns a function that gets an entropy component from the source.
   *
   * The result is returned synchronously to prevent `loadSources` from
   * waiting for one source to load before getting the components from the other sources.
   */
  function loadSource(source, sourceOptions) {
    var isFinalResultLoaded = function (loadResult) {
      return typeof loadResult !== "function";
    };
    var sourceLoadPromise = new Promise(function (resolveLoad) {
      var loadStartTime = Date.now();
      // `awaitIfAsync` is used instead of just `await` in order to measure the duration of synchronous sources
      // correctly (other microtasks won't affect the duration).
      awaitIfAsync(source.bind(null, sourceOptions), function () {
        var loadArgs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          loadArgs[_i] = arguments[_i];
        }
        var loadDuration = Date.now() - loadStartTime;
        // Source loading failed
        if (!loadArgs[0]) {
          return resolveLoad(function () {
            return {
              error: ensureErrorWithMessage(loadArgs[1]),
              duration: loadDuration,
            };
          });
        }
        var loadResult = loadArgs[1];
        // Source loaded with the final result
        if (isFinalResultLoaded(loadResult)) {
          return resolveLoad(function () {
            return { value: loadResult, duration: loadDuration };
          });
        }
        // Source loaded with "get" stage
        resolveLoad(function () {
          return new Promise(function (resolveGet) {
            var getStartTime = Date.now();
            awaitIfAsync(loadResult, function () {
              var getArgs = [];
              for (var _i = 0; _i < arguments.length; _i++) {
                getArgs[_i] = arguments[_i];
              }
              var duration = loadDuration + Date.now() - getStartTime;
              // Source getting failed
              if (!getArgs[0]) {
                return resolveGet({
                  error: ensureErrorWithMessage(getArgs[1]),
                  duration: duration,
                });
              }
              // Source getting succeeded
              resolveGet({ value: getArgs[1], duration: duration });
            });
          });
        });
      });
    });
    return function getComponent() {
      return sourceLoadPromise.then(function (finalizeSource) {
        return finalizeSource();
      });
    };
  }
  /**
   * Loads the given entropy sources. Returns a function that collects the entropy components.
   *
   * The result is returned synchronously in order to allow start getting the components
   * before the sources are loaded completely.
   *
   * Warning for package users:
   * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
   */
  function loadSources(sources, sourceOptions, excludeSources) {
    var includedSources = Object.keys(sources).filter(function (sourceKey) {
      return excludes(excludeSources, sourceKey);
    });
    var sourceGetters = Array(includedSources.length);
    // Using `forEachWithBreaks` allows asynchronous sources to complete between synchronous sources
    // and measure the duration correctly
    forEachWithBreaks(includedSources, function (sourceKey, index) {
      sourceGetters[index] = loadSource(sources[sourceKey], sourceOptions);
    });
    return function getComponents() {
      return __awaiter(this, void 0, void 0, function () {
        var components,
          _i,
          includedSources_1,
          sourceKey,
          componentPromises,
          _loop_1,
          state_1;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              components = {};
              for (
                _i = 0, includedSources_1 = includedSources;
                _i < includedSources_1.length;
                _i++
              ) {
                sourceKey = includedSources_1[_i];
                components[sourceKey] = undefined;
              }
              componentPromises = Array(includedSources.length);
              _loop_1 = function () {
                var hasAllComponentPromises;
                return __generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      hasAllComponentPromises = true;
                      return [
                        4 /*yield*/,
                        forEachWithBreaks(
                          includedSources,
                          function (sourceKey, index) {
                            if (!componentPromises[index]) {
                              // `sourceGetters` may be incomplete at this point of execution because `forEachWithBreaks` is asynchronous
                              if (sourceGetters[index]) {
                                componentPromises[index] = sourceGetters[
                                  index
                                ]().then(function (component) {
                                  return (components[sourceKey] = component);
                                });
                              } else {
                                hasAllComponentPromises = false;
                              }
                            }
                          }
                        ),
                      ];
                    case 1:
                      _a.sent();
                      if (hasAllComponentPromises) {
                        return [2 /*return*/, "break"];
                      }
                      return [4 /*yield*/, wait(1)]; // Lets the source load loop continue
                    case 2:
                      _a.sent(); // Lets the source load loop continue
                      return [2 /*return*/];
                  }
                });
              };
              _a.label = 1;
            case 1:
              return [5 /*yield**/, _loop_1()];
            case 2:
              state_1 = _a.sent();
              if (state_1 === "break") return [3 /*break*/, 4];
              _a.label = 3;
            case 3:
              return [3 /*break*/, 1];
            case 4:
              return [4 /*yield*/, Promise.all(componentPromises)];
            case 5:
              _a.sent();
              return [2 /*return*/, components];
          }
        });
      });
    };
  }

  /*
   * Functions to help with features that vary through browsers
   */
  /**
   * Checks whether the browser is based on Trident (the Internet Explorer engine) without using user-agent.
   *
   * Warning for package users:
   * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
   */
  function isTrident() {
    var w = window;
    var n = navigator;
    // The properties are checked to be in IE 10, IE 11 and not to be in other browsers in October 2020
    return (
      countTruthy([
        "MSCSSMatrix" in w,
        "msSetImmediate" in w,
        "msIndexedDB" in w,
        "msMaxTouchPoints" in n,
        "msPointerEnabled" in n,
      ]) >= 4
    );
  }
  /**
   * Checks whether the browser is based on EdgeHTML (the pre-Chromium Edge engine) without using user-agent.
   *
   * Warning for package users:
   * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
   */
  function isEdgeHTML() {
    // Based on research in October 2020
    var w = window;
    var n = navigator;
    return (
      countTruthy([
        "msWriteProfilerMark" in w,
        "MSStream" in w,
        "msLaunchUri" in n,
        "msSaveBlob" in n,
      ]) >= 3 && !isTrident()
    );
  }
  /**
   * Checks whether the browser is based on Chromium without using user-agent.
   *
   * Warning for package users:
   * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
   */
  function isChromium() {
    // Based on research in October 2020. Tested to detect Chromium 42-86.
    var w = window;
    var n = navigator;
    return (
      countTruthy([
        "webkitPersistentStorage" in n,
        "webkitTemporaryStorage" in n,
        n.vendor.indexOf("Google") === 0,
        "webkitResolveLocalFileSystemURL" in w,
        "BatteryManager" in w,
        "webkitMediaStream" in w,
        "webkitSpeechGrammar" in w,
      ]) >= 5
    );
  }
  /**
   * Checks whether the browser is based on mobile or desktop Safari without using user-agent.
   * All iOS browsers use WebKit (the Safari engine).
   *
   * Warning for package users:
   * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
   */
  function isWebKit() {
    // Based on research in September 2020
    var w = window;
    var n = navigator;
    return (
      countTruthy([
        "ApplePayError" in w,
        "CSSPrimitiveValue" in w,
        "Counter" in w,
        n.vendor.indexOf("Apple") === 0,
        "getStorageUpdates" in n,
        "WebKitMediaKeys" in w,
      ]) >= 4
    );
  }
  /**
   * Checks whether the WebKit browser is a desktop Safari.
   *
   * Warning for package users:
   * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
   */
  function isDesktopSafari() {
    var w = window;
    return (
      countTruthy([
        "safari" in w,
        !("DeviceMotionEvent" in w),
        !("ongestureend" in w),
        !("standalone" in navigator),
      ]) >= 3
    );
  }
  /**
   * Checks whether the browser is based on Gecko (Firefox engine) without using user-agent.
   *
   * Warning for package users:
   * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
   */
  function isGecko() {
    var _a, _b;
    var w = window;
    // Based on research in September 2020
    return (
      countTruthy([
        "buildID" in navigator,
        "MozAppearance" in
          ((_b =
            (_a = document.documentElement) === null || _a === void 0
              ? void 0
              : _a.style) !== null && _b !== void 0
            ? _b
            : {}),
        "MediaRecorderErrorEvent" in w,
        "mozInnerScreenX" in w,
        "CSSMozDocumentRule" in w,
        "CanvasCaptureMediaStream" in w,
      ]) >= 4
    );
  }
  /**
   * Checks whether the browser is based on Chromium version ≥86 without using user-agent.
   * It doesn't check that the browser is based on Chromium, there is a separate function for this.
   */
  function isChromium86OrNewer() {
    // Checked in Chrome 85 vs Chrome 86 both on desktop and Android
    var w = window;
    return (
      countTruthy([
        !("MediaSettingsRange" in w),
        "RTCEncodedAudioFrame" in w,
        "" + w.Intl === "[object Intl]",
        "" + w.Reflect === "[object Reflect]",
      ]) >= 3
    );
  }
  /**
   * Checks whether the browser is based on WebKit version ≥606 (Safari ≥12) without using user-agent.
   * It doesn't check that the browser is based on WebKit, there is a separate function for this.
   *
   * @link https://en.wikipedia.org/wiki/Safari_version_history#Release_history Safari-WebKit versions map
   */
  function isWebKit606OrNewer() {
    // Checked in Safari 9–14
    var w = window;
    return (
      countTruthy([
        "DOMRectList" in w,
        "RTCPeerConnectionIceEvent" in w,
        "SVGGeometryElement" in w,
        "ontransitioncancel" in w,
      ]) >= 3
    );
  }
  /**
   * Checks whether the device is an iPad.
   * It doesn't check that the engine is WebKit and that the WebKit isn't desktop.
   */
  function isIPad() {
    // Checked on:
    // Safari on iPadOS (both mobile and desktop modes): 8, 11, 12, 13, 14
    // Chrome on iPadOS (both mobile and desktop modes): 11, 12, 13, 14
    // Safari on iOS (both mobile and desktop modes): 9, 10, 11, 12, 13, 14
    // Chrome on iOS (both mobile and desktop modes): 9, 10, 11, 12, 13, 14
    // Before iOS 13. Safari tampers the value in "request desktop site" mode since iOS 13.
    if (navigator.platform === "iPad") {
      return true;
    }
    var s = screen;
    var screenRatio = s.width / s.height;
    return (
      countTruthy([
        "MediaSource" in window,
        !!Element.prototype.webkitRequestFullscreen,
        screenRatio > 2 / 3 && screenRatio < 3 / 2,
      ]) >= 2
    );
  }
  /**
   * Warning for package users:
   * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
   */
  function getFullscreenElement() {
    var d = document;
    return (
      d.fullscreenElement ||
      d.msFullscreenElement ||
      d.mozFullScreenElement ||
      d.webkitFullscreenElement ||
      null
    );
  }
  function exitFullscreen() {
    var d = document;
    // `call` is required because the function throws an error without a proper "this" context
    return (
      d.exitFullscreen ||
      d.msExitFullscreen ||
      d.mozCancelFullScreen ||
      d.webkitExitFullscreen
    ).call(d);
  }
  /**
   * Checks whether the device runs on Android without using user-agent.
   *
   * Warning for package users:
   * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
   */
  function isAndroid() {
    var isItChromium = isChromium();
    var isItGecko = isGecko();
    // Only 2 browser engines are presented on Android.
    // Actually, there is also Android 4.1 browser, but it's not worth detecting it at the moment.
    if (!isItChromium && !isItGecko) {
      return false;
    }
    var w = window;
    // Chrome removes all words "Android" from `navigator` when desktop version is requested
    // Firefox keeps "Android" in `navigator.appVersion` when desktop version is requested
    return (
      countTruthy([
        "onorientationchange" in w,
        "orientation" in w,
        isItChromium && "SharedWorker" in w,
        isItGecko && /android/i.test(navigator.appVersion),
      ]) >= 2
    );
  }

  /**
   * A deep description: https://fingerprintjs.com/blog/audio-fingerprinting/
   * Inspired by and based on https://github.com/cozylife/audio-fingerprint
   */
  function getAudioFingerprint() {
    var w = window;
    var AudioContext = w.OfflineAudioContext || w.webkitOfflineAudioContext;
    if (!AudioContext) {
      return -2 /* NotSupported */;
    }
    // In some browsers, audio context always stays suspended unless the context is started in response to a user action
    // (e.g. a click or a tap). It prevents audio fingerprint from being taken at an arbitrary moment of time.
    // Such browsers are old and unpopular, so the audio fingerprinting is just skipped in them.
    // See a similar case explanation at https://stackoverflow.com/questions/46363048/onaudioprocess-not-called-on-ios11#46534088
    if (doesCurrentBrowserSuspendAudioContext()) {
      return -1 /* KnownToSuspend */;
    }
    var hashFromIndex = 4500;
    var hashToIndex = 5000;
    var context = new AudioContext(1, hashToIndex, 44100);
    var oscillator = context.createOscillator();
    oscillator.type = "triangle";
    oscillator.frequency.value = 10000;
    var compressor = context.createDynamicsCompressor();
    compressor.threshold.value = -50;
    compressor.knee.value = 40;
    compressor.ratio.value = 12;
    compressor.attack.value = 0;
    compressor.release.value = 0.25;
    oscillator.connect(compressor);
    compressor.connect(context.destination);
    oscillator.start(0);
    var _a = startRenderingAudio(context),
      renderPromise = _a[0],
      finishRendering = _a[1];
    var fingerprintPromise = renderPromise.then(
      function (buffer) {
        return getHash(buffer.getChannelData(0).subarray(hashFromIndex));
      },
      function (error) {
        if (
          error.name === "timeout" /* Timeout */ ||
          error.name === "suspended" /* Suspended */
        ) {
          return -3 /* Timeout */;
        }
        throw error;
      }
    );
    // Suppresses the console error message in case when the fingerprint fails before requested
    fingerprintPromise.catch(function () {
      return undefined;
    });
    return function () {
      finishRendering();
      return fingerprintPromise;
    };
  }
  /**
   * Checks if the current browser is known to always suspend audio context
   */
  function doesCurrentBrowserSuspendAudioContext() {
    return isWebKit() && !isDesktopSafari() && !isWebKit606OrNewer();
  }
  /**
   * Starts rendering the audio context.
   * When the returned function is called, the render process starts finishing.
   */
  function startRenderingAudio(context) {
    var renderTryMaxCount = 3;
    var renderRetryDelay = 500;
    var runningMaxAwaitTime = 500;
    var runningSufficientTime = 5000;
    var finalize = function () {
      return undefined;
    };
    var resultPromise = new Promise(function (resolve, reject) {
      var isFinalized = false;
      var renderTryCount = 0;
      var startedRunningAt = 0;
      context.oncomplete = function (event) {
        return resolve(event.renderedBuffer);
      };
      var startRunningTimeout = function () {
        setTimeout(function () {
          return reject(makeInnerError("timeout" /* Timeout */));
        }, Math.min(
          runningMaxAwaitTime,
          startedRunningAt + runningSufficientTime - Date.now()
        ));
      };
      var tryRender = function () {
        try {
          context.startRendering();
          switch (context.state) {
            case "running":
              startedRunningAt = Date.now();
              if (isFinalized) {
                startRunningTimeout();
              }
              break;
            // Sometimes the audio context doesn't start after calling `startRendering` (in addition to the cases where
            // audio context doesn't start at all). A known case is starting an audio context when the browser tab is in
            // background on iPhone. Retries usually help in this case.
            case "suspended":
              // The audio context can reject starting until the tab is in foreground. Long fingerprint duration
              // in background isn't a problem, therefore the retry attempts don't count in background. It can lead to
              // a situation when a fingerprint takes very long time and finishes successfully. FYI, the audio context
              // can be suspended when `document.hidden === false` and start running after a retry.
              if (!document.hidden) {
                renderTryCount++;
              }
              if (isFinalized && renderTryCount >= renderTryMaxCount) {
                reject(makeInnerError("suspended" /* Suspended */));
              } else {
                setTimeout(tryRender, renderRetryDelay);
              }
              break;
          }
        } catch (error) {
          reject(error);
        }
      };
      tryRender();
      finalize = function () {
        if (!isFinalized) {
          isFinalized = true;
          if (startedRunningAt > 0) {
            startRunningTimeout();
          }
        }
      };
    });
    return [resultPromise, finalize];
  }
  function getHash(signal) {
    var hash = 0;
    for (var i = 0; i < signal.length; ++i) {
      hash += Math.abs(signal[i]);
    }
    return hash;
  }
  function makeInnerError(name) {
    var error = new Error(name);
    error.name = name;
    return error;
  }

  /**
   * Creates and keeps an invisible iframe while the given function runs.
   * The given function is called when the iframe is loaded and has a body.
   * The iframe allows to measure DOM sizes inside itself.
   *
   * Notice: passing an initial HTML code doesn't work in IE.
   *
   * Warning for package users:
   * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
   */
  function withIframe(action, initialHtml, domPollInterval) {
    var _a, _b, _c;
    if (domPollInterval === void 0) {
      domPollInterval = 50;
    }
    return __awaiter(this, void 0, void 0, function () {
      var d, iframe;
      return __generator(this, function (_d) {
        switch (_d.label) {
          case 0:
            d = document;
            _d.label = 1;
          case 1:
            if (!!d.body) return [3 /*break*/, 3];
            return [4 /*yield*/, wait(domPollInterval)];
          case 2:
            _d.sent();
            return [3 /*break*/, 1];
          case 3:
            iframe = d.createElement("iframe");
            _d.label = 4;
          case 4:
            _d.trys.push([4, , 10, 11]);
            return [
              4 /*yield*/,
              new Promise(function (resolve, reject) {
                iframe.onload = resolve;
                iframe.onerror = reject;
                var style = iframe.style;
                style.setProperty("display", "block", "important"); // Required for browsers to calculate the layout
                style.position = "absolute";
                style.top = "0";
                style.left = "0";
                style.visibility = "hidden";
                if (initialHtml && "srcdoc" in iframe) {
                  iframe.srcdoc = initialHtml;
                } else {
                  iframe.src = "about:blank";
                }
                d.body.appendChild(iframe);
                // WebKit in WeChat doesn't fire the iframe's `onload` for some reason.
                // This code checks for the loading state manually.
                // See https://github.com/fingerprintjs/fingerprintjs/issues/645
                var checkReadyState = function () {
                  var _a, _b;
                  // Make sure iframe.contentWindow and iframe.contentWindow.document are both loaded
                  // The contentWindow.document can miss in JSDOM (https://github.com/jsdom/jsdom).
                  if (
                    ((_b =
                      (_a = iframe.contentWindow) === null || _a === void 0
                        ? void 0
                        : _a.document) === null || _b === void 0
                      ? void 0
                      : _b.readyState) === "complete"
                  ) {
                    resolve();
                  } else {
                    setTimeout(checkReadyState, 10);
                  }
                };
                checkReadyState();
              }),
            ];
          case 5:
            _d.sent();
            _d.label = 6;
          case 6:
            if (
              !!((_b =
                (_a = iframe.contentWindow) === null || _a === void 0
                  ? void 0
                  : _a.document) === null || _b === void 0
                ? void 0
                : _b.body)
            )
              return [3 /*break*/, 8];
            return [4 /*yield*/, wait(domPollInterval)];
          case 7:
            _d.sent();
            return [3 /*break*/, 6];
          case 8:
            return [4 /*yield*/, action(iframe, iframe.contentWindow)];
          case 9:
            return [2 /*return*/, _d.sent()];
          case 10:
            (_c = iframe.parentNode) === null || _c === void 0
              ? void 0
              : _c.removeChild(iframe);
            return [7 /*endfinally*/];
          case 11:
            return [2 /*return*/];
        }
      });
    });
  }
  /**
   * Creates a DOM element that matches the given selector.
   * Only single element selector are supported (without operators like space, +, >, etc).
   */
  function selectorToElement(selector) {
    var _a = parseSimpleCssSelector(selector),
      tag = _a[0],
      attributes = _a[1];
    var element = document.createElement(
      tag !== null && tag !== void 0 ? tag : "div"
    );
    for (var _i = 0, _b = Object.keys(attributes); _i < _b.length; _i++) {
      var name_1 = _b[_i];
      element.setAttribute(name_1, attributes[name_1].join(" "));
    }
    return element;
  }

  // We use m or w because these two characters take up the maximum width.
  // And we use a LLi so that the same matching fonts can get separated.
  var testString = "mmMwWLliI0O&1";
  // We test using 48px font size, we may use any size. I guess larger the better.
  var textSize = "48px";
  // A font will be compared against all the three default fonts.
  // And if it doesn't match all 3 then that font is not available.
  var baseFonts = ["monospace", "sans-serif", "serif"];
  var fontList = [
    // This is android-specific font from "Roboto" family
    "sans-serif-thin",
    "ARNO PRO",
    "Agency FB",
    "Arabic Typesetting",
    "Arial Unicode MS",
    "AvantGarde Bk BT",
    "BankGothic Md BT",
    "Batang",
    "Bitstream Vera Sans Mono",
    "Calibri",
    "Century",
    "Century Gothic",
    "Clarendon",
    "EUROSTILE",
    "Franklin Gothic",
    "Futura Bk BT",
    "Futura Md BT",
    "GOTHAM",
    "Gill Sans",
    "HELV",
    "Haettenschweiler",
    "Helvetica Neue",
    "Humanst521 BT",
    "Leelawadee",
    "Letter Gothic",
    "Levenim MT",
    "Lucida Bright",
    "Lucida Sans",
    "Menlo",
    "MS Mincho",
    "MS Outlook",
    "MS Reference Specialty",
    "MS UI Gothic",
    "MT Extra",
    "MYRIAD PRO",
    "Marlett",
    "Meiryo UI",
    "Microsoft Uighur",
    "Minion Pro",
    "Monotype Corsiva",
    "PMingLiU",
    "Pristina",
    "SCRIPTINA",
    "Segoe UI Light",
    "Serifa",
    "SimHei",
    "Small Fonts",
    "Staccato222 BT",
    "TRAJAN PRO",
    "Univers CE 55 Medium",
    "Vrinda",
    "ZWAdobeF",
  ];
  // kudos to http://www.lalit.org/lab/javascript-css-font-detect/
  function getFonts() {
    // Running the script in an iframe makes it not affect the page look and not be affected by the page CSS. See:
    // https://github.com/fingerprintjs/fingerprintjs/issues/592
    // https://github.com/fingerprintjs/fingerprintjs/issues/628
    return withIframe(function (_, _a) {
      var document = _a.document;
      var holder = document.body;
      holder.style.fontSize = textSize;
      // div to load spans for the default fonts and the fonts to detect
      var spansContainer = document.createElement("div");
      var defaultWidth = {};
      var defaultHeight = {};
      // creates a span where the fonts will be loaded
      var createSpan = function (fontFamily) {
        var span = document.createElement("span");
        var style = span.style;
        style.position = "absolute";
        style.top = "0";
        style.left = "0";
        style.fontFamily = fontFamily;
        span.textContent = testString;
        spansContainer.appendChild(span);
        return span;
      };
      // creates a span and load the font to detect and a base font for fallback
      var createSpanWithFonts = function (fontToDetect, baseFont) {
        return createSpan("'" + fontToDetect + "'," + baseFont);
      };
      // creates spans for the base fonts and adds them to baseFontsDiv
      var initializeBaseFontsSpans = function () {
        return baseFonts.map(createSpan);
      };
      // creates spans for the fonts to detect and adds them to fontsDiv
      var initializeFontsSpans = function () {
        // Stores {fontName : [spans for that font]}
        var spans = {};
        var _loop_1 = function (font) {
          spans[font] = baseFonts.map(function (baseFont) {
            return createSpanWithFonts(font, baseFont);
          });
        };
        for (var _i = 0, fontList_1 = fontList; _i < fontList_1.length; _i++) {
          var font = fontList_1[_i];
          _loop_1(font);
        }
        return spans;
      };
      // checks if a font is available
      var isFontAvailable = function (fontSpans) {
        return baseFonts.some(function (baseFont, baseFontIndex) {
          return (
            fontSpans[baseFontIndex].offsetWidth !== defaultWidth[baseFont] ||
            fontSpans[baseFontIndex].offsetHeight !== defaultHeight[baseFont]
          );
        });
      };
      // create spans for base fonts
      var baseFontsSpans = initializeBaseFontsSpans();
      // create spans for fonts to detect
      var fontsSpans = initializeFontsSpans();
      // add all the spans to the DOM
      holder.appendChild(spansContainer);
      // get the default width for the three base fonts
      for (var index = 0; index < baseFonts.length; index++) {
        defaultWidth[baseFonts[index]] = baseFontsSpans[index].offsetWidth; // width for the default font
        defaultHeight[baseFonts[index]] = baseFontsSpans[index].offsetHeight; // height for the default font
      }
      // check available fonts
      return fontList.filter(function (font) {
        return isFontAvailable(fontsSpans[font]);
      });
    });
  }

  function getPlugins() {
    var rawPlugins = navigator.plugins;
    if (!rawPlugins) {
      return undefined;
    }
    var plugins = [];
    // Safari 10 doesn't support iterating navigator.plugins with for...of
    for (var i = 0; i < rawPlugins.length; ++i) {
      var plugin = rawPlugins[i];
      if (!plugin) {
        continue;
      }
      var mimeTypes = [];
      for (var j = 0; j < plugin.length; ++j) {
        var mimeType = plugin[j];
        mimeTypes.push({
          type: mimeType.type,
          suffixes: mimeType.suffixes,
        });
      }
      plugins.push({
        name: plugin.name,
        description: plugin.description,
        mimeTypes: mimeTypes,
      });
    }
    return plugins;
  }

  // https://www.browserleaks.com/canvas#how-does-it-work
  function getCanvasFingerprint() {
    var _a = makeCanvasContext(),
      canvas = _a[0],
      context = _a[1];
    if (!isSupported(canvas, context)) {
      return { winding: false, geometry: "", text: "" };
    }
    return {
      winding: doesSupportWinding(context),
      geometry: makeGeometryImage(canvas, context),
      // Text is unstable:
      // https://github.com/fingerprintjs/fingerprintjs/issues/583
      // https://github.com/fingerprintjs/fingerprintjs/issues/103
      // Therefore it's extracted into a separate image.
      text: makeTextImage(canvas, context),
    };
  }
  function makeCanvasContext() {
    var canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    return [canvas, canvas.getContext("2d")];
  }
  function isSupported(canvas, context) {
    // TODO: look into: https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob
    return !!(context && canvas.toDataURL);
  }
  function doesSupportWinding(context) {
    // https://web.archive.org/web/20170825024655/http://blogs.adobe.com/webplatform/2013/01/30/winding-rules-in-canvas/
    // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/canvas/winding.js
    context.rect(0, 0, 10, 10);
    context.rect(2, 2, 6, 6);
    return !context.isPointInPath(5, 5, "evenodd");
  }
  function makeTextImage(canvas, context) {
    // Resizing the canvas cleans it
    canvas.width = 240;
    canvas.height = 60;
    context.textBaseline = "alphabetic";
    context.fillStyle = "#f60";
    context.fillRect(100, 1, 62, 20);
    context.fillStyle = "#069";
    // It's important to use explicit built-in fonts in order to exclude the affect of font preferences
    // (there is a separate entropy source for them).
    context.font = '11pt "Times New Roman"';
    // The choice of emojis has a gigantic impact on rendering performance (especially in FF).
    // Some newer emojis cause it to slow down 50-200 times.
    // There must be no text to the right of the emoji, see https://github.com/fingerprintjs/fingerprintjs/issues/574
    // A bare emoji shouldn't be used because the canvas will change depending on the script encoding:
    // https://github.com/fingerprintjs/fingerprintjs/issues/66
    // Escape sequence shouldn't be used too because Terser will turn it into a bare unicode.
    var printedText =
      "Cwm fjordbank gly " + String.fromCharCode(55357, 56835); /* 😃 */
    context.fillText(printedText, 2, 15);
    context.fillStyle = "rgba(102, 204, 0, 0.2)";
    context.font = "18pt Arial";
    context.fillText(printedText, 4, 45);
    return save(canvas);
  }
  function makeGeometryImage(canvas, context) {
    // Resizing the canvas cleans it
    canvas.width = 122;
    canvas.height = 110;
    // Canvas blending
    // https://web.archive.org/web/20170826194121/http://blogs.adobe.com/webplatform/2013/01/28/blending-features-in-canvas/
    // http://jsfiddle.net/NDYV8/16/
    context.globalCompositeOperation = "multiply";
    for (
      var _i = 0,
        _a = [
          ["#f2f", 40, 40],
          ["#2ff", 80, 40],
          ["#ff2", 60, 80],
        ];
      _i < _a.length;
      _i++
    ) {
      var _b = _a[_i],
        color = _b[0],
        x = _b[1],
        y = _b[2];
      context.fillStyle = color;
      context.beginPath();
      context.arc(x, y, 40, 0, Math.PI * 2, true);
      context.closePath();
      context.fill();
    }
    // Canvas winding
    // http://blogs.adobe.com/webplatform/2013/01/30/winding-rules-in-canvas/
    // http://jsfiddle.net/NDYV8/19/
    context.fillStyle = "#f9c";
    context.arc(60, 60, 60, 0, Math.PI * 2, true);
    context.arc(60, 60, 20, 0, Math.PI * 2, true);
    context.fill("evenodd");
    return save(canvas);
  }
  function save(canvas) {
    // TODO: look into: https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob
    return canvas.toDataURL();
  }

  /**
   * This is a crude and primitive touch screen detection. It's not possible to currently reliably detect the availability
   * of a touch screen with a JS, without actually subscribing to a touch event.
   *
   * @see http://www.stucox.com/blog/you-cant-detect-a-touchscreen/
   * @see https://github.com/Modernizr/Modernizr/issues/548
   */
  function getTouchSupport() {
    var n = navigator;
    var maxTouchPoints = 0;
    var touchEvent;
    if (n.maxTouchPoints !== undefined) {
      maxTouchPoints = toInt(n.maxTouchPoints);
    } else if (n.msMaxTouchPoints !== undefined) {
      maxTouchPoints = n.msMaxTouchPoints;
    }
    try {
      document.createEvent("TouchEvent");
      touchEvent = true;
    } catch (_a) {
      touchEvent = false;
    }
    var touchStart = "ontouchstart" in window;
    return {
      maxTouchPoints: maxTouchPoints,
      touchEvent: touchEvent,
      touchStart: touchStart,
    };
  }

  function getOsCpu() {
    return navigator.oscpu;
  }

  function getLanguages() {
    var n = navigator;
    var result = [];
    var language =
      n.language || n.userLanguage || n.browserLanguage || n.systemLanguage;
    if (language !== undefined) {
      result.push([language]);
    }
    if (Array.isArray(n.languages)) {
      // Starting from Chromium 86, there is only a single value in `navigator.language` in Incognito mode:
      // the value of `navigator.language`. Therefore the value is ignored in this browser.
      if (!(isChromium() && isChromium86OrNewer())) {
        result.push(n.languages);
      }
    } else if (typeof n.languages === "string") {
      var languages = n.languages;
      if (languages) {
        result.push(languages.split(","));
      }
    }
    return result;
  }

  function getColorDepth() {
    return window.screen.colorDepth;
  }

  function getDeviceMemory() {
    // `navigator.deviceMemory` is a string containing a number in some unidentified cases
    return replaceNaN(toFloat(navigator.deviceMemory), undefined);
  }

  function getScreenResolution() {
    var s = screen;
    // Some browsers return screen resolution as strings, e.g. "1200", instead of a number, e.g. 1200.
    // I suspect it's done by certain plugins that randomize browser properties to prevent fingerprinting.
    // Some browsers even return  screen resolution as not numbers.
    var parseDimension = function (value) {
      return replaceNaN(toInt(value), null);
    };
    var dimensions = [parseDimension(s.width), parseDimension(s.height)];
    dimensions.sort().reverse();
    return dimensions;
  }

  var screenFrameCheckInterval = 2500;
  var roundingPrecision = 10;
  // The type is readonly to protect from unwanted mutations
  var screenFrameBackup;
  var screenFrameSizeTimeoutId;
  /**
   * Starts watching the screen frame size. When a non-zero size appears, the size is saved and the watch is stopped.
   * Later, when `getScreenFrame` runs, it will return the saved non-zero size if the current size is null.
   *
   * This trick is required to mitigate the fact that the screen frame turns null in some cases.
   * See more on this at https://github.com/fingerprintjs/fingerprintjs/issues/568
   */
  function watchScreenFrame() {
    if (screenFrameSizeTimeoutId !== undefined) {
      return;
    }
    var checkScreenFrame = function () {
      var frameSize = getCurrentScreenFrame();
      if (isFrameSizeNull(frameSize)) {
        screenFrameSizeTimeoutId = setTimeout(
          checkScreenFrame,
          screenFrameCheckInterval
        );
      } else {
        screenFrameBackup = frameSize;
        screenFrameSizeTimeoutId = undefined;
      }
    };
    checkScreenFrame();
  }
  function getScreenFrame() {
    var _this = this;
    watchScreenFrame();
    return function () {
      return __awaiter(_this, void 0, void 0, function () {
        var frameSize;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              frameSize = getCurrentScreenFrame();
              if (!isFrameSizeNull(frameSize)) return [3 /*break*/, 2];
              if (screenFrameBackup) {
                return [2 /*return*/, __spreadArrays(screenFrameBackup)];
              }
              if (!getFullscreenElement()) return [3 /*break*/, 2];
              // Some browsers set the screen frame to zero when programmatic fullscreen is on.
              // There is a chance of getting a non-zero frame after exiting the fullscreen.
              // See more on this at https://github.com/fingerprintjs/fingerprintjs/issues/568
              return [4 /*yield*/, exitFullscreen()];
            case 1:
              // Some browsers set the screen frame to zero when programmatic fullscreen is on.
              // There is a chance of getting a non-zero frame after exiting the fullscreen.
              // See more on this at https://github.com/fingerprintjs/fingerprintjs/issues/568
              _a.sent();
              frameSize = getCurrentScreenFrame();
              _a.label = 2;
            case 2:
              if (!isFrameSizeNull(frameSize)) {
                screenFrameBackup = frameSize;
              }
              return [2 /*return*/, frameSize];
          }
        });
      });
    };
  }
  /**
   * Sometimes the available screen resolution changes a bit, e.g. 1900x1440 → 1900x1439. A possible reason: macOS Dock
   * shrinks to fit more icons when there is too little space. The rounding is used to mitigate the difference.
   */
  function getRoundedScreenFrame() {
    var _this = this;
    var screenFrameGetter = getScreenFrame();
    return function () {
      return __awaiter(_this, void 0, void 0, function () {
        var frameSize, processSize;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [4 /*yield*/, screenFrameGetter()];
            case 1:
              frameSize = _a.sent();
              processSize = function (sideSize) {
                return sideSize === null
                  ? null
                  : round(sideSize, roundingPrecision);
              };
              // It might look like I don't know about `for` and `map`.
              // In fact, such code is used to avoid TypeScript issues without using `as`.
              return [
                2 /*return*/,
                [
                  processSize(frameSize[0]),
                  processSize(frameSize[1]),
                  processSize(frameSize[2]),
                  processSize(frameSize[3]),
                ],
              ];
          }
        });
      });
    };
  }
  function getCurrentScreenFrame() {
    var s = screen;
    // Some browsers return screen resolution as strings, e.g. "1200", instead of a number, e.g. 1200.
    // I suspect it's done by certain plugins that randomize browser properties to prevent fingerprinting.
    //
    // Some browsers (IE, Edge ≤18) don't provide `screen.availLeft` and `screen.availTop`. The property values are
    // replaced with 0 in such cases to not lose the entropy from `screen.availWidth` and `screen.availHeight`.
    return [
      replaceNaN(toFloat(s.availTop), null),
      replaceNaN(
        toFloat(s.width) -
          toFloat(s.availWidth) -
          replaceNaN(toFloat(s.availLeft), 0),
        null
      ),
      replaceNaN(
        toFloat(s.height) -
          toFloat(s.availHeight) -
          replaceNaN(toFloat(s.availTop), 0),
        null
      ),
      replaceNaN(toFloat(s.availLeft), null),
    ];
  }
  function isFrameSizeNull(frameSize) {
    for (var i = 0; i < 4; ++i) {
      if (frameSize[i]) {
        return false;
      }
    }
    return true;
  }

  function getHardwareConcurrency() {
    // sometimes hardware concurrency is a string
    return replaceNaN(toInt(navigator.hardwareConcurrency), undefined);
  }

  function getTimezone() {
    var _a;
    var DateTimeFormat =
      (_a = window.Intl) === null || _a === void 0 ? void 0 : _a.DateTimeFormat;
    if (DateTimeFormat) {
      var timezone = new DateTimeFormat().resolvedOptions().timeZone;
      if (timezone) {
        return timezone;
      }
    }
    // For browsers that don't support timezone names
    // The minus is intentional because the JS offset is opposite to the real offset
    var offset = -getTimezoneOffset();
    return "UTC" + (offset >= 0 ? "+" : "") + Math.abs(offset);
  }
  function getTimezoneOffset() {
    var currentYear = new Date().getFullYear();
    // The timezone offset may change over time due to daylight saving time (DST) shifts.
    // The non-DST timezone offset is used as the result timezone offset.
    // Since the DST season differs in the northern and the southern hemispheres,
    // both January and July timezones offsets are considered.
    return Math.max(
      // `getTimezoneOffset` returns a number as a string in some unidentified cases
      toFloat(new Date(currentYear, 0, 1).getTimezoneOffset()),
      toFloat(new Date(currentYear, 6, 1).getTimezoneOffset())
    );
  }

  function getSessionStorage() {
    try {
      return !!window.sessionStorage;
    } catch (error) {
      /* SecurityError when referencing it means it exists */
      return true;
    }
  }

  // https://bugzilla.mozilla.org/show_bug.cgi?id=781447
  function getLocalStorage() {
    try {
      return !!window.localStorage;
    } catch (e) {
      /* SecurityError when referencing it means it exists */
      return true;
    }
  }

  function getIndexedDB() {
    // IE and Edge don't allow accessing indexedDB in private mode, therefore IE and Edge will have different
    // visitor identifier in normal and private modes.
    if (isTrident() || isEdgeHTML()) {
      return undefined;
    }
    try {
      return !!window.indexedDB;
    } catch (e) {
      /* SecurityError when referencing it means it exists */
      return true;
    }
  }

  function getOpenDatabase() {
    return !!window.openDatabase;
  }

  function getCpuClass() {
    return navigator.cpuClass;
  }

  function getPlatform() {
    // Android Chrome 86 and 87 and Android Firefox 80 and 84 don't mock the platform value when desktop mode is requested
    var platform = navigator.platform;
    // iOS mocks the platform value when desktop version is requested: https://github.com/fingerprintjs/fingerprintjs/issues/514
    // iPad uses desktop mode by default since iOS 13
    // The value is 'MacIntel' on M1 Macs
    // The value is 'iPhone' on iPod Touch
    if (platform === "MacIntel") {
      if (isWebKit() && !isDesktopSafari()) {
        return isIPad() ? "iPad" : "iPhone";
      }
    }
    return platform;
  }

  function getVendor() {
    return navigator.vendor || "";
  }

  /**
   * Checks for browser-specific (not engine specific) global variables to tell browsers with the same engine apart.
   * Only somewhat popular browsers are considered.
   */
  function getVendorFlavors() {
    var flavors = [];
    for (
      var _i = 0,
        _a = [
          // Blink and some browsers on iOS
          "chrome",
          // Safari on macOS
          "safari",
          // Chrome on iOS (checked in 85 on 13 and 87 on 14)
          "__crWeb",
          "__gCrWeb",
          // Yandex Browser on iOS, macOS and Android (checked in 21.2 on iOS 14, macOS and Android)
          "yandex",
          // Yandex Browser on iOS (checked in 21.2 on 14)
          "__yb",
          "__ybro",
          // Firefox on iOS (checked in 32 on 14)
          "__firefox__",
          // Edge on iOS (checked in 46 on 14)
          "__edgeTrackingPreventionStatistics",
          "webkit",
          // Opera Touch on iOS (checked in 2.6 on 14)
          "oprt",
          // Samsung Internet on Android (checked in 11.1)
          "samsungAr",
          // UC Browser on Android (checked in 12.10 and 13.0)
          "ucweb",
          "UCShellJava",
          // Puffin on Android (checked in 9.0)
          "puffinDevice",
        ];
      _i < _a.length;
      _i++
    ) {
      var key = _a[_i];
      var value = window[key];
      if (value && typeof value === "object") {
        flavors.push(key);
      }
    }
    return flavors.sort();
  }

  /**
   * navigator.cookieEnabled cannot detect custom or nuanced cookie blocking configurations. For example, when blocking
   * cookies via the Advanced Privacy Settings in IE9, it always returns true. And there have been issues in the past with
   * site-specific exceptions. Don't rely on it.
   *
   * @see https://github.com/Modernizr/Modernizr/blob/master/feature-detects/cookies.js Taken from here
   */
  function areCookiesEnabled() {
    var d = document;
    // Taken from here: https://github.com/Modernizr/Modernizr/blob/master/feature-detects/cookies.js
    // navigator.cookieEnabled cannot detect custom or nuanced cookie blocking configurations. For example, when blocking
    // cookies via the Advanced Privacy Settings in IE9, it always returns true. And there have been issues in the past
    // with site-specific exceptions. Don't rely on it.
    // try..catch because some in situations `document.cookie` is exposed but throws a
    // SecurityError if you try to access it; e.g. documents created from data URIs
    // or in sandboxed iframes (depending on flags/context)
    try {
      // Create cookie
      d.cookie = "cookietest=1; SameSite=Strict;";
      var result = d.cookie.indexOf("cookietest=") !== -1;
      // Delete cookie
      d.cookie =
        "cookietest=1; SameSite=Strict; expires=Thu, 01-Jan-1970 00:00:01 GMT";
      return result;
    } catch (e) {
      return false;
    }
  }

  /**
   * Only single element selector are supported (no operators like space, +, >, etc).
   * `embed` and `position: fixed;` will be considered as blocked anyway because it always has no offsetParent.
   * Avoid `iframe` and anything with `[src=]` because they produce excess HTTP requests.
   *
   * See docs/content_blockers.md to learn how to make the list
   */
  var filters = {
    abpIndo: [
      "#Iklan-Melayang",
      "#Kolom-Iklan-728",
      "#SidebarIklan-wrapper",
      'a[title="7naga poker" i]',
      '[title="ALIENBOLA" i]',
    ],
    abpvn: [
      "#quangcaomb",
      ".i-said-no-thing-can-stop-me-warning.dark",
      ".quangcao",
      '[href^="https://r88.vn/"]',
      '[href^="https://zbet.vn/"]',
    ],
    adBlockFinland: [
      ".mainostila",
      ".sponsorit",
      ".ylamainos",
      'a[href*="/clickthrgh.asp?"]',
      'a[href^="https://app.readpeak.com/ads"]',
    ],
    adBlockPersian: [
      "#navbar_notice_50",
      'a[href^="http://g1.v.fwmrm.net/ad/"]',
      ".kadr",
      'TABLE[width="140px"]',
      "#divAgahi",
    ],
    adBlockWarningRemoval: [
      "#adblock_message",
      ".adblockInfo",
      ".deadblocker-header-bar",
      ".no-ad-reminder",
      "#AdBlockDialog",
    ],
    adGuardAnnoyances: [
      'amp-embed[type="zen"]',
      ".hs-sosyal",
      "#cookieconsentdiv",
      'div[class^="app_gdpr"]',
      ".as-oil",
    ],
    adGuardBase: [
      "#ad-fullbanner2-billboard-outer",
      ".stky-ad-footer",
      ".BetterJsPopOverlay",
      "#ad_300X250",
      "#bannerfloat22",
    ],
    adGuardChinese: [
      '#piao_div_0[style*="width:140px;"]',
      'a[href*=".ttz5.cn"]',
      'a[href*=".yabovip2027.com/"]',
      ".tm3all2h4b",
      "#duilian_left",
    ],
    adGuardFrench: [
      "#anAdScGp300x25",
      'a[href*=".kfiopkln.com/"]',
      'a[href^="https://jsecoin.com/o/?"]',
      'a[href^="https://www.clickadu.com/?"]',
      ".bandeauClosePub",
    ],
    adGuardGerman: [
      ".banneritemwerbung_head_1",
      ".boxstartwerbung",
      ".werbung3",
      'a[href^="http://www.eis.de/index.phtml?refid="]',
      'a[href^="https://www.tipico.com/?affiliateId="]',
    ],
    adGuardJapanese: [
      "#kauli_yad_1",
      ".adArticleSidetile",
      ".ads_entrymore",
      'a[href^="http://ad2.trafficgate.net/"]',
      'a[href^="http://www.rssad.jp/"]',
    ],
    adGuardMobile: [
      "amp-auto-ads",
      "#mgid_iframe",
      ".amp_ad",
      "amp-sticky-ad",
      ".plugin-blogroll",
    ],
    adGuardRussian: [
      'a[href^="https://ya-distrib.ru/r/"]',
      'a[href^="https://ad.letmeads.com/"]',
      ".reclama",
      'div[id^="smi2adblock"]',
      'div[id^="AdFox_banner_"]',
    ],
    adGuardSocial: [
      'a[href^="//www.stumbleupon.com/submit?url="]',
      'a[href^="//telegram.me/share/url?"]',
      ".etsy-tweet",
      "#inlineShare",
      ".popup-social",
    ],
    adGuardSpanishPortuguese: [
      "#barraPublicidade",
      "#Publicidade",
      "#publiEspecial",
      "#queTooltip",
      '[href^="http://ads.glispa.com/"]',
    ],
    adGuardTrackingProtection: [
      'amp-embed[type="taboola"]',
      "#qoo-counter",
      'a[href^="http://click.hotlog.ru/"]',
      'a[href^="http://hitcounter.ru/top/stat.php"]',
      'a[href^="http://top.mail.ru/jump"]',
    ],
    adGuardTurkish: [
      "#backkapat",
      "#reklami",
      'a[href^="http://adserv.ontek.com.tr/"]',
      'a[href^="http://izlenzi.com/campaign/"]',
      'a[href^="http://www.installads.net/"]',
    ],
    bulgarian: [
      "td#freenet_table_ads",
      "#newAd",
      "#ea_intext_div",
      ".lapni-pop-over",
      "#xenium_hot_offers",
    ],
    easyList: [
      "#adlabelheader",
      "#anAdScGame300x250",
      "#adTakeOverLeft",
      "#ad_LargeRec01",
      "#adundergame",
    ],
    easyListChina: [
      'a[href*=".wensixuetang.com/"]',
      'A[href*="/hth107.com/"]',
      '.appguide-wrap[onclick*="bcebos.com"]',
      ".frontpageAdvM",
      "#taotaole",
    ],
    easyListCookie: [
      "#Button_Cookie",
      "#CWCookie",
      "#CookieCon",
      "#DGPR",
      "#PnlCookie",
    ],
    easyListCzechSlovak: [
      "#onlajny-stickers",
      "#reklamni-box",
      ".reklama-megaboard",
      ".sklik",
      '[id^="sklikReklama"]',
    ],
    easyListDutch: [
      "#advertentie",
      "#vipAdmarktBannerBlock",
      ".adstekst",
      'a[href^="http://adserver.webads.nl/adclick/"]',
      "#semilo-lrectangle",
    ],
    easyListGermany: [
      "#nativendo-hometop",
      'a[href^="http://www.kontakt-vermittler.de/?wm="]',
      "#gwerbung",
      'a[href^="https://marketing.net.brillen.de/"]',
      ".werbenbox",
    ],
    easyListItaly: [
      ".box_adv_annunci",
      ".sb-box-pubbliredazionale",
      'a[href^="http://affiliazioniads.snai.it/"]',
      'a[href^="https://adserver.html.it/"]',
      'a[href^="https://affiliazioniads.snai.it/"]',
    ],
    easyListLithuania: [
      ".reklamos_tarpas",
      ".reklamos_nuorodos",
      'img[alt="Reklaminis skydelis"]',
      'img[alt="Dedikuoti.lt serveriai"]',
      'img[alt="Hostingas Serveriai.lt"]',
    ],
    estonian: ['A[href*="http://pay4results24.eu"]'],
    fanboyAnnoyances: [
      "#feedback-tab",
      "#taboola-below-article",
      ".feedburnerFeedBlock",
      ".widget-feedburner-counter",
      '[title="Subscribe to our blog"]',
    ],
    fanboyAntiFacebook: [".util-bar-module-firefly-visible"],
    fanboyEnhancedTrackers: [
      ".open.pushModal",
      "#issuem-leaky-paywall-articles-zero-remaining-nag",
      'div[style*="box-shadow: rgb(136, 136, 136) 0px 0px 12px; color: "]',
      'div[class$="-hide"][zoompage-fontsize][style="display: block;"]',
      ".BlockNag__Card",
    ],
    fanboySocial: [
      ".td-tags-and-social-wrapper-box",
      ".twitterContainer",
      ".youtube-social",
      'a[title^="Like us on Facebook"]',
      'img[alt^="Share on Digg"]',
    ],
    frellwitSwedish: [
      'a[href*="casinopro.se"][target="_blank"]',
      'a[href*="doktor-se.onelink.me"]',
      "article.category-samarbete",
      "div.holidAds",
      "ul.adsmodern",
    ],
    greekAdBlock: [
      'A[href*="adman.otenet.gr/click?"]',
      'A[href*="http://axiabanners.exodus.gr/"]',
      'A[href*="http://interactive.forthnet.gr/click?"]',
      "DIV.agores300",
      "TABLE.advright",
    ],
    hungarian: [
      'A[href*="ad.eval.hu"]',
      'A[href*="ad.netmedia.hu"]',
      'A[href*="daserver.ultraweb.hu"]',
      "#cemp_doboz",
      ".optimonk-iframe-container",
    ],
    iDontCareAboutCookies: [
      '.alert-info[data-block-track*="CookieNotice"]',
      ".ModuleTemplateCookieIndicator",
      ".o--cookies--container",
      ".cookie-msg-info-container",
      "#cookies-policy-sticky",
    ],
    icelandicAbp: ['A[href^="/framework/resources/forms/ads.aspx"]'],
    latvian: [
      'a[href="http://www.salidzini.lv/"][style="display: block; width: 120px; height: 40px; overflow: hidden; position: relative;"]',
      'a[href="http://www.salidzini.lv/"][style="display: block; width: 88px; height: 31px; overflow: hidden; position: relative;"]',
    ],
    listKr: [
      'a[href*="//kingtoon.slnk.kr"]',
      'a[href*="//playdsb.com/kr"]',
      "div.logly-lift-adz",
      'div[data-widget_id="ml6EJ074"]',
      "ins.daum_ddn_area",
    ],
    listeAr: [
      ".geminiLB1Ad",
      ".right-and-left-sponsers",
      'a[href*=".aflam.info"]',
      'a[href*="booraq.org"]',
      'a[href*="dubizzle.com/ar/?utm_source="]',
    ],
    listeFr: [
      'a[href^="http://promo.vador.com/"]',
      "#adcontainer_recherche",
      'a[href*="weborama.fr/fcgi-bin/"]',
      ".site-pub-interstitiel",
      'div[id^="crt-"][data-criteo-id]',
    ],
    officialPolish: [
      "#ceneo-placeholder-ceneo-12",
      '[href^="https://aff.sendhub.pl/"]',
      'a[href^="http://advmanager.techfun.pl/redirect/"]',
      'a[href^="http://www.trizer.pl/?utm_source"]',
      "div#skapiec_ad",
    ],
    ro: [
      'a[href^="//afftrk.altex.ro/Counter/Click"]',
      'a[href^="/magazin/"]',
      'a[href^="https://blackfridaysales.ro/trk/shop/"]',
      'a[href^="https://event.2performant.com/events/click"]',
      'a[href^="https://l.profitshare.ro/"]',
    ],
    ruAd: [
      'a[href*="//febrare.ru/"]',
      'a[href*="//utimg.ru/"]',
      'a[href*="://chikidiki.ru"]',
      "#pgeldiz",
      ".yandex-rtb-block",
    ],
    thaiAds: [
      "a[href*=macau-uta-popup]",
      "#ads-google-middle_rectangle-group",
      ".ads300s",
      ".bumq",
      ".img-kosana",
    ],
    webAnnoyancesUltralist: [
      "#mod-social-share-2",
      "#social-tools",
      ".ctpl-fullbanner",
      ".zergnet-recommend",
      ".yt.btn-link.btn-md.btn",
    ],
  };
  /** Just a syntax sugar */
  var filterNames = Object.keys(filters);
  /**
   * The order of the returned array means nothing (it's always sorted alphabetically).
   *
   * Notice that the source is slightly unstable.
   * Safari provides a 2-taps way to disable all content blockers on a page temporarily.
   * Also content blockers can be disabled permanently for a domain, but it requires 4 taps.
   * So empty array shouldn't be treated as "no blockers", it should be treated as "no signal".
   * If you are a website owner, don't make your visitors want to disable content blockers.
   */
  function getDomBlockers(_a) {
    var debug = (_a === void 0 ? {} : _a).debug;
    return __awaiter(this, void 0, void 0, function () {
      var allSelectors, blockedSelectors, activeBlockers;
      var _b;
      return __generator(this, function (_c) {
        switch (_c.label) {
          case 0:
            if (!isApplicable()) {
              return [2 /*return*/, undefined];
            }
            allSelectors = (_b = []).concat.apply(
              _b,
              filterNames.map(function (filterName) {
                return filters[filterName];
              })
            );
            return [4 /*yield*/, getBlockedSelectors(allSelectors)];
          case 1:
            blockedSelectors = _c.sent();
            if (debug) {
              printDebug(blockedSelectors);
            }
            activeBlockers = filterNames.filter(function (filterName) {
              var selectors = filters[filterName];
              var blockedCount = countTruthy(
                selectors.map(function (selector) {
                  return blockedSelectors[selector];
                })
              );
              return blockedCount > selectors.length * 0.6;
            });
            activeBlockers.sort();
            return [2 /*return*/, activeBlockers];
        }
      });
    });
  }
  function isApplicable() {
    // Safari (desktop and mobile) and all Android browsers keep content blockers in both regular and private mode
    return isWebKit() || isAndroid();
  }
  function getBlockedSelectors(selectors) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
      var d, root, elements, blockedSelectors, i, element, holder, i;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            d = document;
            root = d.createElement("div");
            elements = new Array(selectors.length);
            blockedSelectors = {}; // Set() isn't used just in case somebody need older browser support
            forceShow(root);
            // First create all elements that can be blocked. If the DOM steps below are done in a single cycle,
            // browser will alternate tree modification and layout reading, that is very slow.
            for (i = 0; i < selectors.length; ++i) {
              element = selectorToElement(selectors[i]);
              holder = d.createElement("div"); // Protects from unwanted effects of `+` and `~` selectors of filters
              forceShow(holder);
              holder.appendChild(element);
              root.appendChild(holder);
              elements[i] = element;
            }
            _b.label = 1;
          case 1:
            if (!!d.body) return [3 /*break*/, 3];
            return [4 /*yield*/, wait(50)];
          case 2:
            _b.sent();
            return [3 /*break*/, 1];
          case 3:
            d.body.appendChild(root);
            try {
              // Then check which of the elements are blocked
              for (i = 0; i < selectors.length; ++i) {
                if (!elements[i].offsetParent) {
                  blockedSelectors[selectors[i]] = true;
                }
              }
            } finally {
              // Then remove the elements
              (_a = root.parentNode) === null || _a === void 0
                ? void 0
                : _a.removeChild(root);
            }
            return [2 /*return*/, blockedSelectors];
        }
      });
    });
  }
  function forceShow(element) {
    element.style.setProperty("display", "block", "important");
  }
  function printDebug(blockedSelectors) {
    var message = "DOM blockers debug:\n```";
    for (
      var _i = 0, filterNames_1 = filterNames;
      _i < filterNames_1.length;
      _i++
    ) {
      var filterName = filterNames_1[_i];
      message += "\n" + filterName + ":";
      for (var _a = 0, _b = filters[filterName]; _a < _b.length; _a++) {
        var selector = _b[_a];
        message +=
          "\n  " + selector + " " + (blockedSelectors[selector] ? "🚫" : "➡️");
      }
    }
    // console.log is ok here because it's under a debug clause
    // eslint-disable-next-line no-console
    console.log(message + "\n```");
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/color-gamut
   */
  function getColorGamut() {
    // rec2020 includes p3 and p3 includes srgb
    for (var _i = 0, _a = ["rec2020", "p3", "srgb"]; _i < _a.length; _i++) {
      var gamut = _a[_i];
      if (matchMedia("(color-gamut: " + gamut + ")").matches) {
        return gamut;
      }
    }
    return undefined;
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/inverted-colors
   */
  function areColorsInverted() {
    if (doesMatch("inverted")) {
      return true;
    }
    if (doesMatch("none")) {
      return false;
    }
    return undefined;
  }
  function doesMatch(value) {
    return matchMedia("(inverted-colors: " + value + ")").matches;
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors
   */
  function areColorsForced() {
    if (doesMatch$1("active")) {
      return true;
    }
    if (doesMatch$1("none")) {
      return false;
    }
    return undefined;
  }
  function doesMatch$1(value) {
    return matchMedia("(forced-colors: " + value + ")").matches;
  }

  var maxValueToCheck = 100;
  /**
   * If the display is monochrome (e.g. black&white), the value will be ≥0 and will mean the number of bits per pixel.
   * If the display is not monochrome, the returned value will be 0.
   * If the browser doesn't support this feature, the returned value will be undefined.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/monochrome
   */
  function getMonochromeDepth() {
    if (!matchMedia("(min-monochrome: 0)").matches) {
      // The media feature isn't supported by the browser
      return undefined;
    }
    // A variation of binary search algorithm can be used here.
    // But since expected values are very small (≤10), there is no sense in adding the complexity.
    for (var i = 0; i <= maxValueToCheck; ++i) {
      if (matchMedia("(max-monochrome: " + i + ")").matches) {
        return i;
      }
    }
    throw new Error("Too high value");
  }

  /**
   * @see https://www.w3.org/TR/mediaqueries-5/#prefers-contrast
   * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-contrast
   */
  function getContrastPreference() {
    if (doesMatch$2("no-preference")) {
      return 0 /* None */;
    }
    // The sources contradict on the keywords. Probably 'high' and 'low' will never be implemented.
    // Need to check it when all browsers implement the feature.
    if (doesMatch$2("high") || doesMatch$2("more")) {
      return 1 /* More */;
    }
    if (doesMatch$2("low") || doesMatch$2("less")) {
      return -1 /* Less */;
    }
    if (doesMatch$2("forced")) {
      return 10 /* ForcedColors */;
    }
    return undefined;
  }
  function doesMatch$2(value) {
    return matchMedia("(prefers-contrast: " + value + ")").matches;
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
   */
  function isMotionReduced() {
    if (doesMatch$3("reduce")) {
      return true;
    }
    if (doesMatch$3("no-preference")) {
      return false;
    }
    return undefined;
  }
  function doesMatch$3(value) {
    return matchMedia("(prefers-reduced-motion: " + value + ")").matches;
  }

  /**
   * @see https://www.w3.org/TR/mediaqueries-5/#dynamic-range
   */
  function isHDR() {
    if (doesMatch$4("high")) {
      return true;
    }
    if (doesMatch$4("standard")) {
      return false;
    }
    return undefined;
  }
  function doesMatch$4(value) {
    return matchMedia("(dynamic-range: " + value + ")").matches;
  }

  var M = Math; // To reduce the minified code size
  var fallbackFn = function () {
    return 0;
  };
  // Native operations
  var acos = M.acos || fallbackFn;
  var acosh = M.acosh || fallbackFn;
  var asin = M.asin || fallbackFn;
  var asinh = M.asinh || fallbackFn;
  var atanh = M.atanh || fallbackFn;
  var atan = M.atan || fallbackFn;
  var sin = M.sin || fallbackFn;
  var sinh = M.sinh || fallbackFn;
  var cos = M.cos || fallbackFn;
  var cosh = M.cosh || fallbackFn;
  var tan = M.tan || fallbackFn;
  var tanh = M.tanh || fallbackFn;
  var exp = M.exp || fallbackFn;
  var expm1 = M.expm1 || fallbackFn;
  var log1p = M.log1p || fallbackFn;
  // Operation polyfills
  var powPI = function (value) {
    return M.pow(M.PI, value);
  };
  var acoshPf = function (value) {
    return M.log(value + M.sqrt(value * value - 1));
  };
  var asinhPf = function (value) {
    return M.log(value + M.sqrt(value * value + 1));
  };
  var atanhPf = function (value) {
    return M.log((1 + value) / (1 - value)) / 2;
  };
  var sinhPf = function (value) {
    return M.exp(value) - 1 / M.exp(value) / 2;
  };
  var coshPf = function (value) {
    return (M.exp(value) + 1 / M.exp(value)) / 2;
  };
  var expm1Pf = function (value) {
    return M.exp(value) - 1;
  };
  var tanhPf = function (value) {
    return (M.exp(2 * value) - 1) / (M.exp(2 * value) + 1);
  };
  var log1pPf = function (value) {
    return M.log(1 + value);
  };
  /**
   * @see https://gitlab.torproject.org/legacy/trac/-/issues/13018
   * @see https://bugzilla.mozilla.org/show_bug.cgi?id=531915
   */
  function getMathFingerprint() {
    // Note: constant values are empirical
    return {
      acos: acos(0.123124234234234242),
      acosh: acosh(1e308),
      acoshPf: acoshPf(1e154),
      asin: asin(0.123124234234234242),
      asinh: asinh(1),
      asinhPf: asinhPf(1),
      atanh: atanh(0.5),
      atanhPf: atanhPf(0.5),
      atan: atan(0.5),
      sin: sin(-1e300),
      sinh: sinh(1),
      sinhPf: sinhPf(1),
      cos: cos(10.000000000123),
      cosh: cosh(1),
      coshPf: coshPf(1),
      tan: tan(-1e300),
      tanh: tanh(1),
      tanhPf: tanhPf(1),
      exp: exp(1),
      expm1: expm1(1),
      expm1Pf: expm1Pf(1),
      log1p: log1p(10),
      log1pPf: log1pPf(10),
      powPI: powPI(-100),
    };
  }

  /**
   * We use m or w because these two characters take up the maximum width.
   * Also there are a couple of ligatures.
   */
  var defaultText = "mmMwWLliI0fiflO&1";
  /**
   * Settings of text blocks to measure. The keys are random but persistent words.
   */
  var presets = {
    /**
     * The default font. User can change it in desktop Chrome, desktop Firefox, IE 11,
     * Android Chrome (but only when the size is ≥ than the default) and Android Firefox.
     */
    default: [],
    /** OS font on macOS. User can change its size and weight. Applies after Safari restart. */
    apple: [{ font: "-apple-system-body" }],
    /** User can change it in desktop Chrome and desktop Firefox. */
    serif: [{ fontFamily: "serif" }],
    /** User can change it in desktop Chrome and desktop Firefox. */
    sans: [{ fontFamily: "sans-serif" }],
    /** User can change it in desktop Chrome and desktop Firefox. */
    mono: [{ fontFamily: "monospace" }],
    /**
     * Check the smallest allowed font size. User can change it in desktop Chrome, desktop Firefox and desktop Safari.
     * The height can be 0 in Chrome on a retina display.
     */
    min: [{ fontSize: "1px" }],
    /** Tells one OS from another in desktop Chrome. */
    system: [{ fontFamily: "system-ui" }],
  };
  /**
   * The result is a dictionary of the width of the text samples.
   * Heights aren't included because they give no extra entropy and are unstable.
   *
   * The result is very stable in IE 11, Edge 18 and Safari 14.
   * The result changes when the OS pixel density changes in Chromium 87. The real pixel density is required to solve,
   * but seems like it's impossible: https://stackoverflow.com/q/1713771/1118709.
   * The "min" and the "mono" (only on Windows) value may change when the page is zoomed in Firefox 87.
   */
  function getFontPreferences() {
    return withNaturalFonts(function (document, container) {
      var elements = {};
      var sizes = {};
      // First create all elements to measure. If the DOM steps below are done in a single cycle,
      // browser will alternate tree modification and layout reading, that is very slow.
      for (var _i = 0, _a = Object.keys(presets); _i < _a.length; _i++) {
        var key = _a[_i];
        var _b = presets[key],
          _c = _b[0],
          style = _c === void 0 ? {} : _c,
          _d = _b[1],
          text = _d === void 0 ? defaultText : _d;
        var element = document.createElement("span");
        element.textContent = text;
        element.style.whiteSpace = "nowrap";
        for (var _e = 0, _f = Object.keys(style); _e < _f.length; _e++) {
          var name_1 = _f[_e];
          var value = style[name_1];
          if (value !== undefined) {
            element.style[name_1] = value;
          }
        }
        elements[key] = element;
        container.appendChild(document.createElement("br"));
        container.appendChild(element);
      }
      // Then measure the created elements
      for (var _g = 0, _h = Object.keys(presets); _g < _h.length; _g++) {
        var key = _h[_g];
        sizes[key] = elements[key].getBoundingClientRect().width;
      }
      return sizes;
    });
  }
  /**
   * Creates a DOM environment that provides the most natural font available, including Android OS font.
   * Measurements of the elements are zoom-independent.
   * Don't put a content to measure inside an absolutely positioned element.
   */
  function withNaturalFonts(action, containerWidthPx) {
    if (containerWidthPx === void 0) {
      containerWidthPx = 4000;
    }
    /*
     * Requirements for Android Chrome to apply the system font size to a text inside an iframe:
     * - The iframe mustn't have a `display: none;` style;
     * - The text mustn't be positioned absolutely;
     * - The text block must be wide enough.
     *   2560px on some devices in portrait orientation for the biggest font size option (32px);
     * - There must be much enough text to form a few lines (I don't know the exact numbers);
     * - The text must have the `text-size-adjust: none` style. Otherwise the text will scale in "Desktop site" mode;
     *
     * Requirements for Android Firefox to apply the system font size to a text inside an iframe:
     * - The iframe document must have a header: `<meta name="viewport" content="width=device-width, initial-scale=1" />`.
     *   The only way to set it is to use the `srcdoc` attribute of the iframe;
     * - The iframe content must get loaded before adding extra content with JavaScript;
     *
     * https://example.com as the iframe target always inherits Android font settings so it can be used as a reference.
     *
     * Observations on how page zoom affects the measurements:
     * - macOS Safari 11.1, 12.1, 13.1, 14.0: zoom reset + offsetWidth = 100% reliable;
     * - macOS Safari 11.1, 12.1, 13.1, 14.0: zoom reset + getBoundingClientRect = 100% reliable;
     * - macOS Safari 14.0: offsetWidth = 5% fluctuation;
     * - macOS Safari 14.0: getBoundingClientRect = 5% fluctuation;
     * - iOS Safari 9, 10, 11.0, 12.0: haven't found a way to zoom a page (pinch doesn't change layout);
     * - iOS Safari 13.1, 14.0: zoom reset + offsetWidth = 100% reliable;
     * - iOS Safari 13.1, 14.0: zoom reset + getBoundingClientRect = 100% reliable;
     * - iOS Safari 14.0: offsetWidth = 100% reliable;
     * - iOS Safari 14.0: getBoundingClientRect = 100% reliable;
     * - Chrome 42, 65, 80, 87: zoom 1/devicePixelRatio + offsetWidth = 1px fluctuation;
     * - Chrome 42, 65, 80, 87: zoom 1/devicePixelRatio + getBoundingClientRect = 100% reliable;
     * - Chrome 87: offsetWidth = 1px fluctuation;
     * - Chrome 87: getBoundingClientRect = 0.7px fluctuation;
     * - Firefox 48, 51: offsetWidth = 10% fluctuation;
     * - Firefox 48, 51: getBoundingClientRect = 10% fluctuation;
     * - Firefox 52, 53, 57, 62, 66, 67, 68, 71, 75, 80, 84: offsetWidth = width 100% reliable, height 10% fluctuation;
     * - Firefox 52, 53, 57, 62, 66, 67, 68, 71, 75, 80, 84: getBoundingClientRect = width 100% reliable, height 10%
     *   fluctuation;
     * - Android Chrome 86: haven't found a way to zoom a page (pinch doesn't change layout);
     * - Android Firefox 84: font size in accessibility settings changes all the CSS sizes, but offsetWidth and
     *   getBoundingClientRect keep measuring with regular units, so the size reflects the font size setting and doesn't
     *   fluctuate;
     * - IE 11, Edge 18: zoom 1/devicePixelRatio + offsetWidth = 100% reliable;
     * - IE 11, Edge 18: zoom 1/devicePixelRatio + getBoundingClientRect = reflects the zoom level;
     * - IE 11, Edge 18: offsetWidth = 100% reliable;
     * - IE 11, Edge 18: getBoundingClientRect = 100% reliable;
     */
    return withIframe(function (_, iframeWindow) {
      var iframeDocument = iframeWindow.document;
      var iframeBody = iframeDocument.body;
      var bodyStyle = iframeBody.style;
      bodyStyle.width = containerWidthPx + "px";
      bodyStyle.webkitTextSizeAdjust = bodyStyle.textSizeAdjust = "none";
      // See the big comment above
      if (isChromium()) {
        iframeBody.style.zoom = "" + 1 / iframeWindow.devicePixelRatio;
      } else if (isWebKit()) {
        iframeBody.style.zoom = "reset";
      }
      // See the big comment above
      var linesOfText = iframeDocument.createElement("div");
      linesOfText.textContent = __spreadArrays(
        Array((containerWidthPx / 20) << 0)
      )
        .map(function () {
          return "word";
        })
        .join(" ");
      iframeBody.appendChild(linesOfText);
      return action(iframeDocument, iframeBody);
    }, '<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1">');
  }

  /**
   * The list of entropy sources used to make visitor identifiers.
   *
   * This value isn't restricted by Semantic Versioning, i.e. it may be changed without bumping minor or major version of
   * this package.
   */
  var sources = {
    // READ FIRST:
    // See https://github.com/fingerprintjs/fingerprintjs/blob/master/contributing.md#how-to-make-an-entropy-source
    // to learn how entropy source works and how to make your own.
    // The sources run in this exact order. The asynchronous sources are at the start to run in parallel with other sources.
    fonts: getFonts,
    domBlockers: getDomBlockers,
    fontPreferences: getFontPreferences,
    audio: getAudioFingerprint,
    screenFrame: getRoundedScreenFrame,
    osCpu: getOsCpu,
    languages: getLanguages,
    colorDepth: getColorDepth,
    deviceMemory: getDeviceMemory,
    screenResolution: getScreenResolution,
    hardwareConcurrency: getHardwareConcurrency,
    timezone: getTimezone,
    sessionStorage: getSessionStorage,
    localStorage: getLocalStorage,
    indexedDB: getIndexedDB,
    openDatabase: getOpenDatabase,
    cpuClass: getCpuClass,
    platform: getPlatform,
    plugins: getPlugins,
    canvas: getCanvasFingerprint,
    touchSupport: getTouchSupport,
    vendor: getVendor,
    vendorFlavors: getVendorFlavors,
    cookiesEnabled: areCookiesEnabled,
    colorGamut: getColorGamut,
    invertedColors: areColorsInverted,
    forcedColors: areColorsForced,
    monochrome: getMonochromeDepth,
    contrast: getContrastPreference,
    reducedMotion: isMotionReduced,
    hdr: isHDR,
    math: getMathFingerprint,
  };
  /**
   * Loads the built-in entropy sources.
   * Returns a function that collects the entropy components to make the visitor identifier.
   */
  function loadBuiltinSources(options) {
    return loadSources(sources, options, []);
  }

  var commentTemplate = "$ if upgrade to Pro: https://fpjs.dev/pro";
  function getConfidence(components) {
    var openConfidenceScore = getOpenConfidenceScore(components);
    var proConfidenceScore = deriveProConfidenceScore(openConfidenceScore);
    return {
      score: openConfidenceScore,
      comment: commentTemplate.replace(/\$/g, "" + proConfidenceScore),
    };
  }
  function getOpenConfidenceScore(components) {
    // In order to calculate the true probability of the visitor identifier being correct, we need to know the number of
    // website visitors (the higher the number, the less the probability because the fingerprint entropy is limited).
    // JS agent doesn't know the number of visitors, so we can only do an approximate assessment.
    if (isAndroid()) {
      return 0.4;
    }
    // Safari (mobile and desktop)
    if (isWebKit()) {
      return isDesktopSafari() ? 0.5 : 0.3;
    }
    var platform = components.platform.value || "";
    // Windows
    if (/^Win/.test(platform)) {
      // The score is greater than on macOS because of the higher variety of devices running Windows.
      // Chrome provides more entropy than Firefox according too
      // https://netmarketshare.com/browser-market-share.aspx?options=%7B%22filter%22%3A%7B%22%24and%22%3A%5B%7B%22platform%22%3A%7B%22%24in%22%3A%5B%22Windows%22%5D%7D%7D%5D%7D%2C%22dateLabel%22%3A%22Trend%22%2C%22attributes%22%3A%22share%22%2C%22group%22%3A%22browser%22%2C%22sort%22%3A%7B%22share%22%3A-1%7D%2C%22id%22%3A%22browsersDesktop%22%2C%22dateInterval%22%3A%22Monthly%22%2C%22dateStart%22%3A%222019-11%22%2C%22dateEnd%22%3A%222020-10%22%2C%22segments%22%3A%22-1000%22%7D
      // So we assign the same score to them.
      return 0.6;
    }
    // macOS
    if (/^Mac/.test(platform)) {
      // Chrome provides more entropy than Safari and Safari provides more entropy than Firefox.
      // Chrome is more popular than Safari and Safari is more popular than Firefox according to
      // https://netmarketshare.com/browser-market-share.aspx?options=%7B%22filter%22%3A%7B%22%24and%22%3A%5B%7B%22platform%22%3A%7B%22%24in%22%3A%5B%22Mac%20OS%22%5D%7D%7D%5D%7D%2C%22dateLabel%22%3A%22Trend%22%2C%22attributes%22%3A%22share%22%2C%22group%22%3A%22browser%22%2C%22sort%22%3A%7B%22share%22%3A-1%7D%2C%22id%22%3A%22browsersDesktop%22%2C%22dateInterval%22%3A%22Monthly%22%2C%22dateStart%22%3A%222019-11%22%2C%22dateEnd%22%3A%222020-10%22%2C%22segments%22%3A%22-1000%22%7D
      // So we assign the same score to them.
      return 0.5;
    }
    // Another platform, e.g. a desktop Linux. It's rare, so it should be pretty unique.
    return 0.7;
  }
  function deriveProConfidenceScore(openConfidenceScore) {
    return round(0.99 + 0.01 * openConfidenceScore, 0.0001);
  }

  function componentsToCanonicalString(components) {
    var result = "";
    for (
      var _i = 0, _a = Object.keys(components).sort();
      _i < _a.length;
      _i++
    ) {
      var componentKey = _a[_i];
      var component = components[componentKey];
      var value = component.error ? "error" : JSON.stringify(component.value);
      result +=
        "" +
        (result ? "|" : "") +
        componentKey.replace(/([:|\\])/g, "\\$1") +
        ":" +
        value;
    }
    return result;
  }
  function componentsToDebugString(components) {
    return JSON.stringify(
      components,
      function (_key, value) {
        if (value instanceof Error) {
          return errorToObject(value);
        }
        return value;
      },
      2
    );
  }
  function hashComponents(components) {
    return x64hash128(componentsToCanonicalString(components));
  }
  /**
   * Makes a GetResult implementation that calculates the visitor id hash on demand.
   * Designed for optimisation.
   */
  function makeLazyGetResult(components) {
    var visitorIdCache;
    // This function runs very fast, so there is no need to make it lazy
    var confidence = getConfidence(components);
    // A plain class isn't used because its getters and setters aren't enumerable.
    return {
      get visitorId() {
        if (visitorIdCache === undefined) {
          visitorIdCache = hashComponents(this.components);
        }
        return visitorIdCache;
      },
      set visitorId(visitorId) {
        visitorIdCache = visitorId;
      },
      confidence: confidence,
      components: components,
      version: version,
    };
  }
  /**
   * A delay is required to ensure consistent entropy components.
   * See https://github.com/fingerprintjs/fingerprintjs/issues/254
   * and https://github.com/fingerprintjs/fingerprintjs/issues/307
   * and https://github.com/fingerprintjs/fingerprintjs/commit/945633e7c5f67ae38eb0fea37349712f0e669b18
   */
  function prepareForSources(delayFallback) {
    if (delayFallback === void 0) {
      delayFallback = 50;
    }
    // A proper deadline is unknown. Let it be twice the fallback timeout so that both cases have the same average time.
    return requestIdleCallbackIfAvailable(delayFallback, delayFallback * 2);
  }
  /**
   * The function isn't exported from the index file to not allow to call it without `load()`.
   * The hiding gives more freedom for future non-breaking updates.
   *
   * A factory function is used instead of a class to shorten the attribute names in the minified code.
   * Native private class fields could've been used, but TypeScript doesn't allow them with `"target": "es5"`.
   */
  function makeAgent(getComponents, debug) {
    var creationTime = Date.now();
    return {
      get: function (options) {
        return __awaiter(this, void 0, void 0, function () {
          var startTime, components, result;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                startTime = Date.now();
                return [4 /*yield*/, getComponents()];
              case 1:
                components = _a.sent();
                result = makeLazyGetResult(components);
                if (
                  debug ||
                  (options === null || options === void 0
                    ? void 0
                    : options.debug)
                ) {
                  // console.log is ok here because it's under a debug clause
                  // eslint-disable-next-line no-console
                  console.log(
                    "Copy the text below to get the debug data:\n\n```\nversion: " +
                      result.version +
                      "\nuserAgent: " +
                      navigator.userAgent +
                      "\ntimeBetweenLoadAndGet: " +
                      (startTime - creationTime) +
                      "\nvisitorId: " +
                      result.visitorId +
                      "\ncomponents: " +
                      componentsToDebugString(components) +
                      "\n```"
                  );
                }
                return [2 /*return*/, result];
            }
          });
        });
      },
    };
  }
  /**
   * Builds an instance of Agent and waits a delay required for a proper operation.
   */
  function load(_a) {
    var _b = _a === void 0 ? {} : _a,
      delayFallback = _b.delayFallback,
      debug = _b.debug;
    return __awaiter(this, void 0, void 0, function () {
      var getComponents;
      return __generator(this, function (_c) {
        switch (_c.label) {
          case 0:
            return [4 /*yield*/, prepareForSources(delayFallback)];
          case 1:
            _c.sent();
            getComponents = loadBuiltinSources({ debug: debug });
            return [2 /*return*/, makeAgent(getComponents, debug)];
        }
      });
    });
  }

  // The default export is a syntax sugar (`import * as FP from '...' → import FP from '...'`).
  // It should contain all the public exported values.
  var index = {
    load: load,
    hashComponents: hashComponents,
    componentsToDebugString: componentsToDebugString,
  };

  var FingerprintJS = index;

  let _ = {};
  ["Function", "String", "Object", "Number", "Boolean", "Arguments"].forEach(
    (name) => {
      _["is" + name] = function (obj) {
        return toString.call(obj) === "[object " + name + "]";
      };
    }
  );
  var utils = {
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

  /**
   * 监听页面性能
   * @param {*} options
   * {
   *    pageId：页面标示,
   *    url：上报地址,
   *    isPage：是否上报页面性能数据,
   *    isResource：是否上报页面资源数据,
   *    projectId: 项目id
   * }
   */

  function monitorPerformance(options) {
    ttiPolyfill.getFirstConsistentlyInteractive().then(async (tti) => {
      let isPage = options.isPage || true; // 是否上报页面性能数据

      let isResource = options.isResource || true; // 是否上报页面资源数据

      let config = {
        resourceList: [],
        // 资源列表
        performance: {}, // 页面性能列表
      };

      if (isPage) {
        config.performance = getTiming();
      }

      if (isResource) {
        config.resourceList = getEntries();
      }

      let params = {
        time: new Date().getTime(),
        performance: Object.assign(config.performance, {
          tti,
        }),
        resourceList: config.resourceList,
        markUv: await utils.markUv(),
        pageId: options.pageId || "",
        projectId: options.projectId || 0,
        pageUrl: location.href,
        deviceInfo: DeviceInfo.getDeviceInfo(),
        type: "perf",
      };
      console.log("report data =", params); // 发送监控数据

      new API(options.url).report(params);
      clearPerformance();
    });
  }

  /**
   * 错误类型枚举
   */
  class ErrorCategoryEnum {
    /**
     * js 错误
     */
    static get JS_ERROR() {
      return "js_error";
    }
    /**
     * js 错误
     */

    static get IFRAME_ERROR() {
      return "iframe_error";
    }
    /**
     * 资源引用错误
     */

    static get RESOURCE_ERROR() {
      return "resource_error";
    }
    /**
     * Vue错误
     */

    static get VUE_ERROR() {
      return "vue_error";
    }
    /**
     * promise 错误
     */

    static get PROMISE_ERROR() {
      return "promise_error";
    }
    /**
     * ajax异步请求错误
     */

    static get AJAX_ERROR() {
      return "ajax_error";
    }
    /**
     * 控制台错误console.info
     */

    static get CONSOLE_INFO() {
      return "console_info";
    }
    /**
     * 控制台错误console.warn
     */

    static get CONSOLE_WARN() {
      return "console_warn";
    }
    /**
     * 控制台错误console.error
     */

    static get CONSOLE_ERROR() {
      return "console_error";
    }
    /**
     * 跨域js错误
     */

    static get CROSS_SCRIPT_ERROR() {
      return "cross_srcipt_error";
    }
    /**
     * 未知异常
     */

    static get UNKNOW_ERROR() {
      return "unknow_error";
    }
  }
  /**
   * 错误level枚举
   */

  class ErrorLevelEnum {
    /**
     * 错误信息
     */
    static get ERROR() {
      return "Error";
    }
    /**
     * 警告信息
     */

    static get WARN() {
      return "Warning";
    }
    /**
     * 日志信息
     */

    static get INFO() {
      return "Info";
    }
  }
  /**
   * Ajax库枚举
   */

  class AjaxLibEnum {
    static get AJAX() {
      return "ajax";
    }

    static get FETCH() {
      return "fetch";
    }

    static get DEFAULT() {
      return "default";
    }
  }

  /**
   * 消息队列
   */

  let TaskQueue = {
    queues: [],

    // 待处理消息列表

    /**
     * 添加消息
     * @param {*} reportUrl 上报url
     * @param {*} data 上报数据
     */
    add(reportUrl, data) {
      this.queues.push({
        reportUrl,
        data,
      });
    },

    /**
     * 统一上报
     */
    fire() {
      if (!this.queues || this.queues.length === 0) {
        return;
      }

      let item = this.queues[0];
      item.reportUrl && new API(item.reportUrl).report(item.data);
      this.queues.splice(0, 1);
      this.fire(); // 递归
    },
  };

  /**
   * 监控基类
   */

  class Monitor {
    /**
     * 上报错误地址
     * @param {*} params { reportUrl,extendsInfo }
     */
    constructor(params, newCaptureClick) {
      this.reportUrl = params.reportUrl; // 上报错误地址

      this.extendsInfo = params.extendsInfo; // 扩展信息

      this.newCaptureClick = newCaptureClick;
    }
    /**
     * 记录错误信息
     * @params 错误参数
     */

    recordError(params) {
      this.handleRecordError(params); //延迟记录日志

      setTimeout(() => {
        TaskQueue.fire();
      }, 100);
    }
    /**
     * 处理记录日志
     */

    handleRecordError(params) {
      try {
        if (!params.msg) {
          return;
        } //过滤掉错误上报地址

        let requestUrl = params.url || params.request.url;

        if (requestUrl.indexOf(this.reportUrl) >= 0) {
          console.log("统计错误接口异常", params);
          return;
        } else {
          console.log("报错接口>>", requestUrl, params);
        }

        let errorInfo = this.handleErrorInfo(params);
        console.log(
          "\n````````````````````` " +
            params.category +
            " `````````````````````\n",
          errorInfo
        ); //记录日志

        TaskQueue.add(this.reportUrl, errorInfo);
      } catch (error) {
        console.log("添加日志记录失败：", error);
      }
    }
    /**
     * 处理错误信息
     * @param {*} extendsInfo
     */

    handleErrorInfo(params) {
      let deviceInfo = this.getDeviceInfo();
      let extendsInfo = this.getExtendsInfo();
      let recordInfo = {
        getErrorId: utils.randomString(),
        url: params.url || location.href,
        // 错误信息地址
        category: params.category || null,
        // 错误分类
        logType: params.level || ErrorLevelEnum.INFO,
        // 错误级别
        msg: params.msg || null,
        // 错误信息
        deviceInfo: deviceInfo,
        // 设备信息
        time: new Date().getTime(), // 错误时间
      };
      Object.assign(recordInfo, extendsInfo);
      let txt = `错误类别: ${params.category}\r\n`;
      txt += `日志信息: ${params.msg}\r\n`;
      txt += `URL: ${params.url}\r\n`;

      switch (params.category) {
        case ErrorCategoryEnum.JS_ERROR:
          recordInfo.name = params.name || null; // 错误名

          recordInfo.type = params.type || null; // js错误类型

          recordInfo.line = params.line || null; // 行数

          recordInfo.col = params.col || null; // 列数

          recordInfo.stack = params.stack || null; // 错误堆栈

          txt += `错误行号: ${recordInfo.line}\r\n`;
          txt += `错误列号: ${recordInfo.col}\r\n`;

          if (recordInfo.stack) {
            txt += `错误栈: ${recordInfo.stack}\r\n`;
          }

          this.newCaptureClick.reportCaptureImage({
            getErrorId: recordInfo.getErrorId,
            url: this.reportUrl,
          });
          break;

        case ErrorCategoryEnum.IFRAME_ERROR:
          recordInfo.name = params.name || null; // 错误名

          recordInfo.type = params.type || null; // js错误类型

          recordInfo.line = params.line || null; // 行数

          recordInfo.col = params.col || null; // 列数

          recordInfo.stack = params.stack || null; // 错误堆栈

          txt += `错误行号: ${recordInfo.line}\r\n`;
          txt += `错误列号: ${recordInfo.col}\r\n`;

          if (recordInfo.stack) {
            txt += `错误栈: ${recordInfo.stack}\r\n`;
          }

          break;

        case ErrorCategoryEnum.AJAX_ERROR:
          recordInfo.request = params.request || {};
          recordInfo.response = params.response || {};
          recordInfo.responseTime = params.responseTime || null;
          break;

        case ErrorCategoryEnum.PROMISE_ERROR:
          recordInfo.resourceUrl = params.resourceUrl || null;
          recordInfo.line = params.line || null;
          recordInfo.col = params.col || null;
          recordInfo.responseTime = params.responseTime || null;
          break;

        case ErrorCategoryEnum.RESOURCE_ERROR:
          recordInfo.resourceUrl = params.resourceUrl || null;
          break;

        case ErrorCategoryEnum.VUE_ERROR:
          recordInfo.vueInfo = params.vueInfo || null;
          recordInfo.name = params.name || null; // 错误名

          recordInfo.resourceUrl = params.resourceUrl || null;
          recordInfo.vueComponentName = params.vueComponentName || null;
          recordInfo.vuePropsData = params.vuePropsData || null;
          recordInfo.line = params.line || null; // 行数

          recordInfo.col = params.col || null; // 列数

          recordInfo.stack = params.stack || null; // 错误堆栈

          txt += `错误行号: ${recordInfo.line}\r\n`;
          txt += `错误列号: ${recordInfo.col}\r\n`;

          if (params.stack) {
            txt += `错误栈: ${recordInfo.stack}\r\n`;
          }

          break;

        default:
          if (params.errorObj && !utils.objectIsNull(params.errorObj)) {
            txt += `其他错误: ${JSON.stringify(params.errorObj)}\r\n`;
          }

          break;
      }

      txt += `设备信息: ${deviceInfo}`; // 设备信息

      recordInfo.logInfo = txt; // 错误信息详细

      return recordInfo;
    }
    /**
     * 获取扩展信息
     */

    getExtendsInfo() {
      try {
        let ret = {};
        let extendsInfo = this.extendsInfo || {};
        let dynamicParams;

        if (utils.isFunction(extendsInfo.getDynamic)) {
          dynamicParams = extendsInfo.getDynamic(); // 获取动态参数
        } // 判断动态方法返回的参数是否是对象

        if (utils.isObject(dynamicParams)) {
          extendsInfo = { ...extendsInfo, ...dynamicParams };
        } // 遍历扩展信息，排除动态方法

        for (var key in extendsInfo) {
          if (!utils.isFunction(extendsInfo[key])) {
            // 排除获取动态方法
            ret[key] = extendsInfo[key];
          }
        }

        return ret;
      } catch (error) {
        console.log("获取扩展信息失败：", error);
        return {};
      }
    }
    /**
     * 获取设备信息
     */

    getDeviceInfo() {
      try {
        let deviceInfo = DeviceInfo.getDeviceInfo();
        return JSON.stringify(deviceInfo);
      } catch (error) {
        console.log(error);
        return "";
      }
    }
  }

  /**
   * ajax error异常
   */

  class AjaxError {
    constructor(params) {
      this.params = params;
    }
    /**
     * 处理错误
     * @param type {*} ajax库类型
     * @param error{*} 错误信息
     */

    handleError(type, error) {
      switch (type) {
        case AjaxLibEnum.AJAX:
          xhrError(this.params);
          break;

        case AjaxLibEnum.FETCH:
          fetchError(this.params);
          break;

        default:
          fetchError(this.params);
          xhrError(this.params);
          break;
      }
    }
  }

  const fetchError = (params) => {
    if (!window.fetch) return;
    let _oldFetch = window.fetch;
    let data = {
      request: {
        method: "GET",
      },
    };

    let _handleEvent = () => {
      try {
        data.level = ErrorLevelEnum.WARN;
        data.category = ErrorCategoryEnum.AJAX_ERROR;
        new Monitor(params).recordError(data);
      } catch (error) {
        console.log("监控fetch错误：", error);
      }
    };

    window.fetch = function () {
      const arg = arguments;
      const args = Array.prototype.slice.apply(arg);
      if (!args || !args.length) return result;

      if (args.length === 1) {
        if (typeof args[0] === "string") {
          data.request.url = args[0];
        } else if (utils.isObject(args[0])) {
          data.request.url = args[0].url;
          data.request.method = args[0].method || "GET";
          data.request.params = JSON.parse(args[0].body) || {};
        }
      } else {
        data.request.url = args[0];
        data.request.method = args[1].method || "GET";
        data.request.params = JSON.parse(args[1].body) || {};
      }

      return _oldFetch
        .apply(this, arguments)
        .then((res) => {
          if (res.status !== 200) {
            // True if status is HTTP 2xx
            // 上报错误
            data.response = {
              status: res.status,
              responseText: res.statusText,
            };
            data.msg = `${data.request.method} ${res.url} ${res.status} (${res.statusText})`;

            _handleEvent();
          }

          return res;
        })
        .catch((error) => {
          // 上报错误/
          data.msg = error.stack || error;

          _handleEvent();

          error.originData = data;
          throw error;
        });
    };
  };
  /**
   * 获取HTTP错误信息
   */

  const xhrError = (params) => {
    /**
     * 获取错误信息
     */
    if (!window.XMLHttpRequest) {
      return;
    } // 保存原生的 open 方法

    let xhrOpen = XMLHttpRequest.prototype.open; // 保存原生的 send 方法

    let xhrSend = XMLHttpRequest.prototype.send;
    let data = {
      request: {
        method: "GET",
      },
    };

    let _handleEvent = (event, arg) => {
      try {
        if (
          event &&
          event.currentTarget &&
          event.currentTarget.status !== 200
        ) {
          data.level = ErrorLevelEnum.WARN;
          data.category = ErrorCategoryEnum.AJAX_ERROR;
          data.msg = `${data.request.method} ${event.target.responseURL} ${event.target.status} (${event.target.statusText})`;
          data.responseTime = event.timeStamp;
          data.request.params = {};

          if (arg.length > 0 && arg[0]) {
            data.request.params = JSON.parse(arg[0]);
          }

          data.request.url = event.target.responseURL;
          data.response = {
            status: event.target.status,
            responseText: event.target.responseText,
          };
          new Monitor(params).recordError(data);
        }
      } catch (error) {
        console.log("监听XHR错误：", error);
      }
    }; // 重写 open

    XMLHttpRequest.prototype.open = function () {
      // 先在此处取得请求的method
      data.request.method = arguments[0]; // 再调用原生 open 实现重写

      return xhrOpen.apply(this, arguments);
    }; // 重写 send

    XMLHttpRequest.prototype.send = function () {
      if (this["addEventListener"]) {
        this["addEventListener"]("error", (e) => _handleEvent(e, arguments)); // 失败

        this["addEventListener"]("load", (e) => _handleEvent(e, arguments)); // 完成

        this["addEventListener"]("abort", (e) => _handleEvent(e, arguments)); // 取消
      } else {
        let tempStateChange = this["onreadystatechange"];

        this["onreadystatechange"] = function (event) {
          tempStateChange.apply(this, arguments);

          if (this.readyState === 4) {
            _handleEvent(event, arguments);
          }
        };
      } // 再调用原生 send 实现重写

      return xhrSend.apply(this, arguments);
    };
  };
  /**
   * Axios类库 错误信息处理(如果不配置，可以统一通过XHR接受错误信息)
   */
  // const axiosError = (params, error) => {
  //     let data
  //     if (error && error.config && error.config.url) {
  //         data.url = error.config.url
  //     }
  //     data.level = ErrorLevelEnum.WARN
  //     data.category = ErrorCategoryEnum.AJAX_ERROR
  //     data.msg = JSON.stringify(error)
  //     new Monitor(params).recordError(data)
  // }
  // axios重写
  // function _Axios() {
  //     let data = {
  //         response: {},
  //         request: {}
  //     }
  //     if (!window.axios) return;
  //     const _axios = window.axios
  //     const List = ['axios', 'request', 'get', 'delete', 'head', 'options', 'put', 'post', 'patch']
  //     List.forEach(item => {
  //         _reseat(item)
  //     })
  //     function _reseat(item) {
  //         let _key = null;
  //         if (item === 'axios') {
  //             window['axios'] = resetFn;
  //             _key = _axios
  //         } else if (item === 'request') {
  //             window['axios']['request'] = resetFn;
  //             _key = _axios['request'];
  //         } else {
  //             window['axios'][item] = resetFn;
  //             _key = _axios[item];
  //         }
  //         function resetFn() {
  //             const result = ajaxArg(arguments, item)
  //             return _key.apply(this, arguments)
  //                 .then(function (res) {
  //                     if (result.report === 'report-data') return res;
  //                     try {
  //                         data.request.url = res.request.responseURL ? res.request.responseURL.split('?')[0] : '';
  //                         // data.request.responseText = res.request.responseText;
  //                         data.request.method = result.method
  //                         data.request.params = result.options
  //                     } catch (e) {}
  //                     return res
  //                 })
  //                 .catch((err) => {
  //                     if (result.report === 'report-data') return res;
  //                     data.msg = err.message
  //                     data.response.status = err.response ? err.response.status : 0
  //                     return err
  //                 })
  //         }
  //     }
  // }
  // // Ajax arguments
  // function ajaxArg(arg, item) {
  //     let result = {
  //         method: 'GET',
  //         type: 'xmlhttprequest',
  //         report: ''
  //     }
  //     let args = Array.prototype.slice.apply(arg)
  //     try {
  //         if (item == 'axios' || item == 'request') {
  //             result.url = args[0].url
  //             result.method = args[0].method
  //             result.options = result.method.toLowerCase() == 'get' ? args[0].params : args[0].data
  //         } else {
  //             result.url = args[0]
  //             result.method = ''
  //             if (args[1]) {
  //                 if (args[1].params) {
  //                     result.method = 'GET'
  //                     result.options = args[1].params;
  //                 } else {
  //                     result.method = 'POST'
  //                     result.options = args[1];
  //                 }
  //             }
  //         }
  //         result.report = args[0].report
  //     } catch (err) {}
  //     return result;
  // }

  /**
   * console.error异常
   */

  class ConsoleError {
    constructor(params) {
      this.params = params;
    }
    /**
     * 处理console事件
     */

    handleError() {
      this.registerInfo();
      this.registerWarn();
      this.registerError();
    }
    /**
     * 处理信息
     */

    registerInfo() {
      let _self = this;

      console.tInfo = function () {
        _self.handleLog(
          ErrorLevelEnum.INFO,
          ErrorCategoryEnum.CONSOLE_INFO,
          arguments
        );
      };
    }
    /**
     * 处理警告
     */

    registerWarn() {
      let _self = this;

      console.tWarn = function () {
        _self.handleLog(
          ErrorLevelEnum.WARN,
          ErrorCategoryEnum.CONSOLE_WARN,
          arguments
        );
      };
    }
    /**
     * 处理错误
     */

    registerError() {
      let _self = this;

      console.tError = function () {
        _self.handleLog(
          ErrorLevelEnum.ERROR,
          ErrorCategoryEnum.CONSOLE_ERROR,
          arguments
        );
      };
    }
    /**
     * 处理日志
     */

    handleLog(level, category, args) {
      let data = {};

      try {
        data.level = level;
        data.category = category;
        let params = [...args];
        data.msg = params.join("\r\n"); // 换行符分割

        new Monitor(this.params).recordError(data);
      } catch (error) {
        console.log("console统计错误异常：", level, error);
      }
    }
  }
  /**
   * 初始化console事件
   */

  (function () {
    //创建空console对象，避免JS报错
    if (!window.console) {
      window.console = {};
    }

    let funcs = ["tInfo", "tWarn", "tError"];
    funcs.forEach((func, index) => {
      if (!console[func]) {
        console[func] = function () {};
      }
    });
  })();

  /**
   * 捕获JS错误
   * onerror用来捕捉预料之外的错误，而try-catch用来在可预见情况下监控特定的错误，两者组合使用更加高效
   * 无论是异步还是非异步错误，onerror都能捕获到运行时错误
   * 当遇到 < img src = "./404.png" > 报404错误异常的时候， 它捕获不到
   * window.onerror只有在函数返回true的时候， 异常才不会向上抛出， 否则即使知道异常的发生控制台还是会显示错误
   * try不能检测到语法错误, 词法解析就挂了，语法解析错误是捕获不了的, onerror也不行
   * try-catch 处理异常的能力有限，只能捕获捉到运行时非异步错误，对于语法错误和异步错误就显得无能为力，捕捉不到。
   */

  class JSError {
    constructor(params, newCaptureClick) {
      this.params = params;
      this.newCaptureClick = newCaptureClick;
    }
    /**
     * window.onerror能捕捉到语法错误，但是语法出错的代码块不能跟window.onerror在同一个块（语法都没过，更别提window.onerror会被执行了）
     * 只要把window.onerror这个代码块分离出去，并且比其他脚本先执行（ 注意这个前提！） 即可捕捉到语法错误。
     * 可以捕捉语法错误，也可以捕捉运行时错误；
     * 可以拿到出错的信息，堆栈，出错的文件、行号、列号；
     * 只要在当前页面执行的js脚本出错都会捕捉到，例如：浏览器插件的javascript、或者flash抛出的异常等。
     * 跨域的资源需要特殊头部支持。
     * 如果想通过onerror函数收集不同域的js错误， 我们需要做两件事：
     * 1. 服务端相关的js文件上加上Access-Control-Allow-Origin: * 的response header
     * 2. 客户端引用相关的js文件时加上crossorigin属性<script src="..." crossorigin="anonymous"></script>
     *
     * 采用异步的方式
     * window.onunload会进行ajax的堵塞上报
     * 由于客户端强制关闭webview导致这次堵塞上报有Network Error
     * 猜测这里window.onerror的执行流在关闭前是必然执行的
     * 而离开页面之后的上报对于业务来说是可丢失的
     * 所以把这里的执行流放到异步事件去执行
     * 脚本的异常数降低了10倍
     */

    handleError() {
      let data = {};

      window.onerror = (msg, url, line, col, error) => {
        try {
          // 没有URL不上报！上报也不知道错误
          if (msg != "Script error." && !url) {
            return true;
          }

          let key = msg.match(/(\w+)/g) || [];
          data.level = ErrorLevelEnum.WARN;
          data.category = ErrorCategoryEnum.JS_ERROR;
          data.name = key.length > 0 && key[0];
          data.type = key.length > 1 && key[1];
          data.msg = msg || null;
          data.url = url || null;
          data.line = line || null; // 不一定所有浏览器都支持col参数
          // 不过 [IE]下 window.event 对象提供了 errorLine 和 errorCharacter，以此来对应相应的行列号信息

          data.col =
            col || (window.event && window.event.errorCharacter) || null;

          if (!!error && !!error.stack) {
            // 如果浏览器有堆栈信息，直接使用
            data.stack = error.stack.toString();
          } else if (!!arguments.callee) {
            // 尝试通过callee拿堆栈信息
            var ext = []; // arguments.callee指向arguments对象的拥有函数引用, caller指向调用它的函数

            var fn = arguments.callee.caller;
            var floor = 3; // 这里只拿三层堆栈信息

            while (fn && --floor > 0) {
              ext.push(fn.toString()); //如果有环

              if (fn === fn.caller) {
                break;
              }

              fn = fn.caller;
            }

            ext = ext.join(",");
            data.stack = ext;
          }

          new Monitor(this.params, this.newCaptureClick).recordError(data);
        } catch (err) {
          console.log("js错误异常：", err);
        }

        return true;
      };
    }
  }

  /**
   * 捕获未处理的Promise异常
   */

  class PromiseError {
    constructor(params) {
      this.params = params;
    }
    /**
     * 处理错误
     */

    handleError() {
      let data = {};
      window.addEventListener("unhandledrejection", (event) => {
        try {
          console.log(">>>>>>>>unhandledrejection>>>>>>>", event);

          if (!event || !event.reason) {
            return;
          }

          const error = event && event.reason;
          const stack = error.stack || ""; // Processing error

          let resourceUrl;
          let errs = stack.match(/\(.+?\)/);

          if (errs && errs.length) {
            errs = errs[0];
            errs = errs.replace(/\w.+[js|html]/g, ($1) => {
              data.resourceUrl = $1;
              return "";
            });
            errs = errs.split(":");

            if (errs.length > 1) {
              data.line = parseInt(errs[1] || null);
              data.col = parseInt(errs[2] || null);
            }
          }

          data.level = ErrorLevelEnum.WARN;
          data.category = ErrorCategoryEnum.PROMISE_ERROR;
          data.msg = event.reason.message || event.reason;
          data.responseTime = event.timeStamp; // 响应时间

          data.url = event.target.document.URL; //判断当前被捕获的异常url，是否是异常处理url，防止死循环

          if (event.reason.originData && event.reason.originData.request.url) {
            data.url = event.reason.originData.request.url;
          }

          new Monitor(this.params).recordError(data);
        } catch (error) {
          console.log("Promise错误监控", error);
        }

        return true;
      });
    }
  }

  /**
   * 资源加载错误
   */

  class ResourceError {
    constructor(params) {
      this.params = params;
    }
    /**
     * 注册onerror事件
     * 由于网络请求异常不会事件冒泡，因此必须在捕获阶段将其捕捉到才行。
     * 这种方式虽然可以捕捉到网络请求的异常，但是无法判断 HTTP 的状态是 404 还是其他比如 500 等等，所以还需要配合服务端日志才进行排查分析才可以。
     */

    handleError() {
      let data = {};
      window.addEventListener(
        "error",
        (event) => {
          try {
            if (!event) {
              return;
            }

            data.category = ErrorCategoryEnum.RESOURCE_ERROR;
            let target = event.target || event.srcElement;
            var isElementTarget =
              target instanceof HTMLScriptElement ||
              target instanceof HTMLLinkElement ||
              target instanceof HTMLImageElement;

            if (!isElementTarget) {
              return; // js error不再处理
            }

            data.level =
              target.tagName.toUpperCase() === "IMG"
                ? ErrorLevelEnum.WARN
                : ErrorLevelEnum.ERROR;
            data.url = target.baseURI;
            data.resourceUrl = target.src || target.href;
            data.msg = `加载 ${target.tagName}资源错误\r\nlink:${data.resourceUrl}`;
            new Monitor(this.params).recordError(data);
          } catch (error) {
            console.log("资源加载收集异常：", error);
          }
        },
        true
      );
    }
  }
  // <img src="..." onerror="noFind();" />
  // function noFind(event){
  //     var img = event.srcElement;
  //     img.src = '...'  // 默认图片地址
  //     img.onerror = null;  // 控制不要循环展示错误
  // }

  /**
   * 捕获未处理的iframes异常
   */

  class FramesError {
    constructor(params) {
      this.params = params;
    }
    /**
     * 处理错误
     */

    handleError() {
      for (let i = 0; i < window.frames.length; i++) {
        let data = {};

        window.frames[i].onerror = (msg, url, row, col, error) => {
          try {
            // 没有URL不上报！上报也不知道错误
            if (msg != "Script error." && !url) {
              return true;
            }

            let key = msg.match(/(\w+)/g) || [];
            data.level = ErrorLevelEnum.WARN;
            data.category = ErrorCategoryEnum.IFRAME_ERROR;
            data.name = key.length > 0 && key[0];
            data.type = key.length > 1 && key[1];
            data.msg = msg || null;
            data.url = url || null;
            data.line = row || null;
            data.col = col || null;

            if (!!error && !!error.stack) {
              // 如果浏览器有堆栈信息，直接使用
              data.stack = error.stack.toString();
            }

            new Monitor(this.params).recordError(data);
          } catch (err) {
            console.log("iframe错误异常：", err);
          }

          return true;
        };
      }
    }
  }

  /**
   * vue错误
   */

  class VueError {
    constructor(params) {
      this.params = params;
    }
    /**
     * 处理Vue错误提示
     */

    handleError(Vue) {
      if (!Vue) {
        return;
      }

      let data = {};

      Vue.config.errorHandler = (error, vm, info) => {
        try {
          let {
            message,
            // 异常信息
            name,
            // 异常名称
            script,
            // 异常脚本url
            line,
            // 异常行号
            column,
            // 异常列号
            stack, // 异常堆栈信息
          } = error;
          data.msg = message;
          data.name = name;
          data.stack = stack || null;
          data.resourceUrl = script || null; // 异常脚本url

          data.line = line || null; // 异常行号

          data.col = column || null; // 异常列号

          let errs = stack.match(/\(.+?\)/);

          if (errs && errs.length) {
            errs = errs[0];
            errs = errs.replace(/\w.+[js|html]/g, ($1) => {
              data.resourceUrl = $1;
              return "";
            });
            errs = errs.split(":");

            if (errs.length > 1) {
              data.line = parseInt(errs[1] || null);
              data.col = parseInt(errs[2] || null);
            }
          }

          data.vueInfo = info;

          if (Object.prototype.toString.call(vm) === "[object Object]") {
            data.vueComponentName = vm._isVue
              ? vm.$options.name || vm.$options._componentTag
              : vm.name;
            data.vuePropsData = vm.$options.propsData;
          }

          data.level = ErrorLevelEnum.WARN;
          data.category = ErrorCategoryEnum.VUE_ERROR;
          new Monitor(this.params).recordError(data);
        } catch (error) {
          console.log("vue错误异常：", error);
        }
      };
    }
  }

  /**
   *
   * @param {url} url  异步加载js
   */

  const insertJs = (url = "") => {
    return new Promise((resolve, reject) => {
      let script = document.createElement("script");
      script.type = "text/javascript";
      script.src = url;
      document.querySelector("head").appendChild(script);

      script.onload = function () {
        resolve();
      };

      script.onerror = function () {
        reject("js加载失败");
      };
    });
  };

  class CaptureClick {
    constructor(params = {}) {
      this.captureClick = params.captureClick || false; // 是否录屏，只录制点击区域

      this.captureMode = params.captureMode || 1; // 截屏模式 1-最小区域 2 - 整屏，

      this.captureReportNum = params.captureReportNum || 1; // 截屏上报个数(最多10个)

      this.capturedDoms = [];
    }

    initCaptureClick() {
      let _self = this;

      if (!_self.captureClick) return;
      window.addEventListener(
        "click",
        (e) => {
          let pathTemp = Array.from(e.path); // html2canvas截取目标只能是document内的dom，所以需要移除window和document

          pathTemp.pop(); // 移除window

          pathTemp.pop(); // 移除document

          if (_self.capturedDoms.length >= 10) {
            _self.capturedDoms.pop(); // 抛出最后一个
          } //录屏模式 1- 最小 2- 全屏

          const path =
            _self.captureMode === 1
              ? pathTemp[0]
              : pathTemp[pathTemp.length - 1];

          _self.capturedDoms.unshift(path); // 插入最前面
        },
        true
      ); // 捕获模式
    }
    /**
     * 录屏上报
     * @param options {url: 上报链接 id: 错误id}
     */

    reportCaptureImage(options) {
      if (!this.captureClick) {
        return;
      } // 上报录屏个数合法性检查

      this.captureReportNum =
        this.captureReportNum > 10 ? 10 : this.captureReportNum;
      this.captureReportNum =
        this.captureReportNum <= 0 ? 1 : this.captureReportNum;
      const tobeReport =
        this.capturedDoms.slice(0, this.captureReportNum) || []; // 从cdn上动态插入

      if (window.html2canvas) {
        if (tobeReport.length) {
          this.dom2img(tobeReport, options);
        }
      } else {
        insertJs(
          "//unpkg.com/html2canvas@1.0.0-alpha.12/dist/html2canvas.min.js"
        )
          .then(() => {
            if (tobeReport.length && window.html2canvas) {
              this.dom2img(tobeReport, options);
            }
          })
          .catch((error) => {
            console.log("录屏失败：", error);
          });
      }
    }

    dom2img(doms = [], options) {
      // 压缩图片地址
      let compressedUrlList = [];

      if (window.LZString && LZString.compress) {
        doms.forEach((dom, index) => {
          html2canvas(dom).then((canvas) => {
            let imageUrl = canvas.toDataURL("image/png");
            compressedUrlList[index] = LZString.compress(imageUrl);
            console.log("截屏压缩图片文件地址：", compressedUrlList[index]);
          });
        }); // new API(options.url).report({compressedUrlList, getErrorId: options.getErrorId})
      } else {
        insertJs("//unpkg.com/lz-string@1.4.4/libs/lz-string.js")
          .then(() => {
            doms.forEach((dom, index) => {
              html2canvas(dom).then((canvas) => {
                let imageUrl = canvas.toDataURL("image/png");
                compressedUrlList[index] = LZString.compress(imageUrl);
                console.log("截屏压缩图片文件地址：", compressedUrlList[index]);
              });
            }); // new API(options.url).report({compressedUrlList, getErrorId: options.getErrorId})
          })
          .catch((error) => {
            console.log("压缩图片失败：", error);
          });
      }
    }
  }

  function monitorError(options) {
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
      new JSError(param, newCaptureClick).handleError();
    }

    if (frameError) {
      new FramesError(param).handleError();
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

  exports.ostrichMonitor = ostrichMonitor;

  Object.defineProperty(exports, "__esModule", { value: true });

  return exports;
})({});
