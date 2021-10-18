import Router from "koa-router";
import context from "./context.js";
import Response from "./Response.js";

export default class KoaRoute {
  constructor(app) {
    this.app = app;
    this.router = new Router();
  }

  get(path, middleware) {
    this.router.get(path, (ctx, next) => {
      let res = new Response(this.app, ctx);
      return middleware.apply(this.router, [ctx, res]);
    });
    this._registerRouter();
    return this;
  }
  post(path, middleware) {
    this.router.post(path, (ctx, next) => {
      let res = new Response(this.app, ctx);
      ctx.body = ctx.request.body;
      return middleware.apply(this.router, [ctx, res]);
    });
    this._registerRouter();
    return this;
  }
  put(path, middleware) {
    this.router.put(path, (ctx, next) => {
      let res = new Response(this.app, ctx);
      ctx.body = ctx.request.body;
      return middleware.apply(this.router, [ctx, res]);
    });
    this._registerRouter();
    return this;
  }
  options(path, middleware) {
    this.router.options(path, (ctx, next) => {
      let res = new Response(this.app, ctx);
      ctx.body = ctx.request.body;
      return middleware.apply(this.router, [ctx, res]);
    });
    this._registerRouter();
    return this;
  }
  patch(path, middleware) {
    this.router.patch(path, (ctx, next) => {
      let res = new Response(this.app, ctx);
      ctx.body = ctx.request.body;
      return middleware.apply(this.router, [ctx, res]);
    });
    this._registerRouter();
    return this;
  }
  delete(path, middleware) {
    let app = this.app;
    this.router.delete(path, (ctx, next) => {
      let res = new Response(app, ctx);
      ctx.body = ctx.request.body;
      return middleware.apply(this.router, [ctx, res]);
    });
    this._registerRouter();
    return this;
  }
  all(path, middleware) {
    this.router.all(path, (ctx, next) => {
      let res = new Response(this.app, ctx);
      ctx.body = ctx.request.body;
      return middleware.apply(this.router, [ctx, res]);
    });
    this._registerRouter();
    return this;
  }

  //中间件
  //支持两种形式：
  // 1：middleware是一个函数数组,[fn, fn]
  // 2：middleware是一个[函数,上下文]数组, [[fn, context], [fn, context]]
  use(pattern, middleware) {
    let self = this;
    let proxyMiddles = middleware.map((fn) => {
      if (typeof fn === "function") {
        return function (ctx, next) {
          let res = new Response(self.app, ctx);
          return fn.apply(self.router, [ctx, res, next]);
        };
      } else if (Array.isArray(fn) && fn.length === 2) {
        return function (ctx, next) {
          let res = new Response(self.app, ctx);
          switch (fn[1].constructor.name) {
            case "InterceptorMidddleware":
              return fn[0].apply(fn[1], [ctx, next]);
              break;
            default:
              return fn[0].apply(fn[1], [ctx, res, next]);
              break;
          }
        };
      }
    });
    this.router.use(pattern, proxyMiddles);
    this._registerRouter();
    return this;
  }
  param(path, middleware) {
    this.router.param(path, middleware);
    this._registerRouter();
    return this;
  }

  prefix(pattern) {
    this.router.prefix(pattern);
    this._registerRouter();
    return this;
  }

  redirect(source, destination, code) {
    this.router.redirect(source, destination, code);
    this._registerRouter();
    return this;
  }

  _registerRouter() {
    this.app.use(this.router.routes(), this.router.allowedMethods());
  }
}
