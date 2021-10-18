import ReportModel from "../models/Report";
import { Provide, inject } from "../../libs/kidi/decorator";
import moment from "moment";

@Provide("ReportService")
export class Report {
  constructor() {
    this.model = inject("ReportModel");
  }

  // 访问信息
  // {
  //   did: "",  设备唯一ID
  //   projectId: "",  项目Id
  //   created_time: "",  创建时间
  //   pageId: "",  页面Id
  //   pageUrl: ""  页面地址
  // }
  addVisit(data) {
    const collection = this.model.getCollection("visit");
    let item = {
      projectId: data.projectId,
      did: data.markUv,
      createdAt: new Date(),
      day: moment().calendar(),
      pageId: data.pageId,
      pageUrl: data.pageUrl,
    };
    return collection.add(item);
  }

  // 性能信息
  // {
  //   did: "",  设备唯一ID
  //   projectId: "", 项目Id
  //   visitId: "",  访问ID
  //   pageId: "",  页面ID
  //   pageUrl: "", 页面地址
  //   analysisTime: "",  解析dom树耗时
  //   appcacheTime: "",  DNS 缓存时间
  //   blankTime: "",  白屏时间
  //   dnsTime: "", DNS 查询时间
  //   domIteractive: "", 可操作时间
  //   domReadyTime: "",  domReadyTime(dom准备时间)
  //   first-contentful-paint: "",  首次有较多内容的绘制时间
  //   first-paint: "",  首次绘制时间
  //   frontend: "",  前端总时间
  //   loadPage: "", 页面加载完成的时间
  //   network: "",  网络总耗时
  //   onload: "",  执行 onload 回调函数的时间
  //   prevPage: "",  上一个页面卸载总耗时
  //   prevUnload: "", 上一个页面卸载耗时
  //   receive: "",  接收数据用时
  //   redirectTime: "",  重定向的时间
  //   request: "",  请求页面总耗时
  //   send: "", 前端从发送请求到接收请求的时间
  //   tcpTime: "",  tcp连接耗时
  //   ttfbTime: "", 读取页面第一个字节的时间
  //   tti: "", 页面可交互时间
  // }
  addPerformance(data, visitId) {
    const collection = this.model.getCollection("performance");
    const perf = data.performance;
    let item = {
      did: data.markUv,
      projectId: data.projectId,
      visitId,
      createdAt: new Date(),
      day: moment().calendar(),
      pageId: data.pageId,
      pageUrl: data.pageUrl,
      analysisTime: perf.analysisTime, //解析dom树耗时
      appcacheTime: perf.appcacheTime, //DNS 缓存时间
      blankTime: perf.blankTime, //白屏时间
      dnsTime: perf.dnsTime, //DNS 查询时间
      domIteractive: perf.domIteractive, //可操作时间
      domReadyTime: perf.domReadyTime, //domReadyTime(dom准备时间)
      firstContentfulPaint: perf["first-contentful-paint"], //首次有较多内容的绘制时间
      firstPaint: perf["first-paint"], //首次绘制时间
      frontend: perf.frontend, //前端总时间
      loadPage: perf.loadPage, //页面加载完成的时间
      network: perf.network, //网络总耗时
      onload: perf.onload, //执行 onload 回调函数的时间
      prevPage: perf.prevPage, //上一个页面卸载总耗时
      prevUnload: perf.prevUnload, //上一个页面卸载耗时
      receive: perf.receive, //接收数据用时
      redirectTime: perf.redirectTime, //重定向的时间
      request: perf.request, //请求页面总耗时
      send: perf.send, //前端从发送请求到接收请求的时间
      tcpTime: perf.tcpTime, //tcp连接耗时
      ttfbTime: perf.ttfbTime, //读取页面第一个字节的时间
      tti: perf.tti, //页面可交互时间
    };
    return collection.add(item);
  }

  // 设备信息
  // {
  //   did: "",
  //   projectId: "", 项目Id
  //   os: "",  操作系统
  //   osVersion: "",  操作系统版本
  //   browserInfo: "",  浏览器及版本
  //   deviceType: "",  设备类型
  //   fingerprint: "",  设备指纹
  //   language: "",  客户端语言
  //   brand: "",  设备品牌
  //   model: "",  设备型号
  //   netWork: "",  网络
  //   orientation: "",  屏幕朝向
  //   screenHeight: "",  屏幕高度
  //   screenWidth: "",  屏幕宽度
  //   userAgent: "",  ua
  // }
  addDevice(data, visitId) {
    const collection = this.model.getCollection("devices");
    const device = data.deviceInfo;
    let item = {
      did: data.markUv,
      projectId: data.projectId,
      visitId,
      os: device.OS,
      osVersion: device.OSVersion,
      browserInfo: device.browserInfo,
      deviceType: device.deviceType,
      fingerprint: device.fingerprint,
      language: device.language,
      brand: device.mobileBrand ? device.mobileBrand : false,
      model: "",
      netWork: device.netWork,
      orientation: device.orientation,
      screenHeight: device.screenHeight,
      screenWidth: device.screenWidth,
      userAgent: device.userAgent,
    };
    return collection.add(item);
  }

  // 页面加载资源信息
  // {
  //   did: "",  设备唯一ID
  //   projectId: "", 项目Id
  //   vistId: "",  vistId
  //   pageId: "",  页面ID
  //   pageUrl: "",  页面地址
  //   dnsTime: "",  dns时间
  //   initiatorType: "",  资源类型
  //   name: "",  资源地址
  //   nextHopProtocol: "",  Http协议
  //   redirectTime: "",  重定向时间
  //   reqTime: "",  请求时间
  //   tcpTime: "",  tcp时间
  // }
  addResource(data, visitId) {
    const collection = this.model.getCollection("resources");
    let items = data.resourceList.map((item) => {
      return {
        did: data.markUv,
        projectId: data.projectId,
        visitId,
        pageId: data.pageId,
        pageUrl: data.pageUrl,
        dnsTime: item.dnsTime,
        initiatorType: item.initiatorType,
        name: item.name,
        nextHopProtocol: item.nextHopProtocol,
        redirectTime: item.redirectTime,
        reqTime: item.reqTime,
        tcpTime: item.tcpTime,
      };
    });
    return collection.batchAdd(items);
  }

  // 信息信息
  // {
  //   did: "",  设备唯一ID
  //   projectId: "", 项目Id
  //   pageId: "",  页面ID
  //   pageUrl: "",  页面地址
  //   category: "",  类型
  //   col: "",  列号
  //   line: "",  行号
  //   level: "",  等级
  //   msg: "",  错误消息
  //   resourceUrl: "",  资源地址
  //   responseTime: "",  响应时间
  //   url: "",  地址
  // }
  addError(data) {
    const collection = this.model.getCollection("errors");
    let item = {
      errorId: data.getErrorId,
      projectId: "", //项目Id
      pageId: "", //页面ID
      pageUrl: "", //页面地址
      category: data.category, //类型
      logInfo: data.logInfo, //等级
      responseTime: data.responseTime, //响应时间
      url: data.url, //地址
      createdAt: new Date(),
      day: moment().calendar(),
      deviceInfo: data.deviceInfo,
    };
    return collection.add(item);
  }
}
