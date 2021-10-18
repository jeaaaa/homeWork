import {
  Controller,
  Post,
  All,
  Exception,
  inject,
} from "../../../libs/kidi/decorator";

import ExceptionMiddleware from "../../middlewares/Exception.js";

@Exception(ExceptionMiddleware)
@Controller("/report")
export default class ReportController {
  constructor() {}
  @All("error")
  async error(req, res) {
    res.set("Access-Control-Allow-Origin", "*"); //允许来自所有域名请求
    res.set("Access-Control-Allow-Credentials", true);
    res.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS,HEAD"); // 设置所允许的HTTP请求方法
    res.set("Access-Control-Allow-Headers", "*");
    res.set("Access-Control-Max-Age", "86400"); // 指定本次预检请求的有效期，单位为秒,在该时间段内服务端可以不用进行验证
    res.set(
      "Access-Control-Allow-Headers",
      "x-requested-with,Authorization,Origin,Content-Type,Accept"
    ); // 字段是必需的,表明服务器支持的所有头信息字段, 服务器收到请求以后，检查了Origin、Access-Control-Request-Method和Access-Control-Request-Headers字段以后，确认允许跨源请求，就可以做出回应

    if (req.request.method === "OPTIONS") {
      res.status(204);
    } else if (req.request.method === "POST") {
      let data = req.body;

      let service = inject("ReportService");
      let result = {};
      if (data.type === "error") {
        result = await service.addError(data);
        res.json({ list: result });
      } else {
        res.status(500).end("数据格式错误");
      }
    } else {
      res.status(401).end("Not Allowed");
    }
  }

  @All("perf")
  async perf(req, res) {
    res.set("Access-Control-Allow-Origin", "*"); //允许来自所有域名请求
    res.set("Access-Control-Allow-Credentials", true);
    res.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS,HEAD"); // 设置所允许的HTTP请求方法
    res.set("Access-Control-Allow-Headers", "*");
    res.set("Access-Control-Max-Age", "86400"); // 指定本次预检请求的有效期，单位为秒,在该时间段内服务端可以不用进行验证
    res.set(
      "Access-Control-Allow-Headers",
      "x-requested-with,Authorization,Origin,Content-Type,Accept"
    ); // 字段是必需的,表明服务器支持的所有头信息字段, 服务器收到请求以后，检查了Origin、Access-Control-Request-Method和Access-Control-Request-Headers字段以后，确认允许跨源请求，就可以做出回应

    if (req.request.method === "OPTIONS") {
      res.status(204);
    } else if (req.request.method === "POST") {
      let data = req.body;

      let service = inject("ReportService");
      let result = {};
      if (data.type === "perf") {
        // 访问信息
        let visit = await service.addVisit(data);
        let visitId = visit.insertedId.toString();
        // 性能信息
        await service.addPerformance(data, visitId);
        // 设备信息
        await service.addDevice(data, visitId);
        // addResource
        await service.addResource(data, visitId);
        res.json({ list: result });
      } else {
        res.status(500).end("数据格式错误");
      }
    } else {
      res.status(401).end("Not Allowed");
    }
  }
}
