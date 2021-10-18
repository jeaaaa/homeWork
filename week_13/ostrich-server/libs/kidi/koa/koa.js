import fs from "fs";
import Koa from "koa";
import path from "path";
import zlib from "zlib";
import etag from "koa-etag";
import bodyParser from "koa-body";
import compress from "koa-compress";
import cors from "koa-cors";
import staticRoot from "koa-static";
import logger from "koa-logger";
import favicon from "koa-favicon";
import responseTime from "koa-response-time";
import Router from "./core/Router.js";

export default function (options) {
  const ROOT = path.dirname(process.argv[1]);
  // console.log("📁 root:", ROOT);
  const app = new Koa();
  let context = {
    routers: {},
  };
  // 路由
  let router = new Router(app);

  // bodyParser
  app.use(
    bodyParser({
      multipart: true,
    })
  );

  //gzip压缩
  app.use(
    compress({
      filter(content_type) {
        return /text/i.test(content_type);
      },
      threshold: 2048,
      gzip: {
        flush: zlib.Z_SYNC_FLUSH,
      },
      deflate: {
        flush: zlib.Z_SYNC_FLUSH,
      },
      br: false, // disable brotli
    })
  );

  app.use(etag());
  //logger
  app.use(logger());
  //response time
  app.use(responseTime({ hrtime: true }));

  //start server
  app.run = async (port, configuration) => {
    //启动
    app.listen(port);
    console.log(`kidi started at 🚀: http://localhost:${port}`);
  };

  return { app, context, router };
}
