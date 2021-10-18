import path from "path";
import factory from "./koa.js";
import context from "./core/context";
import ServerContext from "./core/serverContext";
import { middleware, plugin } from "./core/use";
import GuardMiddleware from "./core/GuardMiddleware";
import PipeMiddleware from "./core/PipeMiddleware";
import Schedule from "./core/Schedule";
import ExceptionMiddleware from "./core/ExceptionMiddleware.js";
import Exception from "./core/Exception.js";
import { travel } from "./core/utils";

export default class KoaApplication {
  constructor(option) {
    this.engine = factory(option);
    context.engine = this.engine;

    //解析文件夹里的模块，后面可动态依赖注入
    this.setUpModules(["src/models", "src/services"]);
  }

  //注册模块
  regist(controller) {
    let className = controller.name;
    let serverContext = new ServerContext(this.engine.app);
    if (context.routers[className]) {
      process.nextTick(() => {
        let { router } = this.engine;
        //注册带路由中间件, 注册Interceptor
        this._regitstMiddleware(serverContext, context, className, router);
        //注册路由
        this._regitstRouter(context, className, router);
      });
      return serverContext;
    } else {
      throw new Exception(
        400,
        "Controller regist failed! Please make sure you have a deceoration @Controller on the Controller"
      );
    }
  }

  //全局注册
  use() {
    // use("interceptor", InterceptionMiddleware);
    middleware(this.engine, ...arguments);
  }

  plugin(pluginClass, options) {
    plugin(this.engine, pluginClass, options);
  }

  //自动引入模块，执行decorator
  setUpModules(paths) {
    if (paths.length > 0) {
      const root = process.cwd();
      paths.forEach((p) => {
        let dir = path.join(root, p);
        travel(dir, async (file) => {
          console.log("setUp>>", file);
          await import(file);
        });
      });
    }
  }

  //注册带路由中间件, 注册Interceptor
  _regitstMiddleware(serverContext, context, className, router) {
    let routeData = context.routers[className];
    let mids = [];
    //exception
    let instance = new ExceptionMiddleware(serverContext);
    mids.push([instance.use, instance]);

    //middleware
    let allMiddlewares = []
      .concat(serverContext.middlewares)
      .concat(context.middlewares[className] || []);
    if (allMiddlewares.length > 0) {
      let fns = allMiddlewares.map((classFn) => {
        let instance = new classFn();
        if (instance.use && typeof instance.use === "function") {
          return [instance.use, instance];
        } else {
          throw new Exception(
            400,
            `Middleware class [${classFn.name}] must contains a 'use' function.`
          );
        }
      });
      mids = mids.concat(fns);
    }
    //guard
    let allguards = []
      .concat(context.guards[className] || [])
      .concat(serverContext.guards);
    if (allguards.length > 0) {
      let instance = new GuardMiddleware(allguards);
      mids.push([instance.use, instance]);
    }
    //interceptor
    let allInterceptors = []
      .concat(context.interceptors[className] || [])
      .concat(serverContext.interceptors);
    if (allInterceptors.length > 0) {
      let fns = allInterceptors.map((classFn) => {
        let instance = new classFn();
        if (instance.intercept && typeof instance.intercept === "function") {
          return [instance.intercept, instance];
        } else {
          throw new Exception(
            400,
            `Interceptor class [${classFn.name}] must contains a 'intercept' function.`
          );
        }
      });
      mids = mids.concat(fns);
    }
    //pipe
    let allPipes = []
      .concat(context.pipes[className] || [])
      .concat(serverContext.pipes);
    if (allPipes.length > 0) {
      let instance = new PipeMiddleware(allPipes);
      mids.push([instance.use, instance]);
    }
    //schedule
    let allShedules = []
      .concat(context.schedules[className] || [])
      .concat(serverContext.schedules);
    if (allShedules.length > 0) {
      new Schedule(this.engine, context, allShedules);
    }

    router.use(routeData.rootPath, mids);
  }

  //注册路由
  _regitstRouter(context, className, router) {
    let routeData = context.routers[className];
    if (routeData.route) {
      Object.keys(routeData.route).forEach((item) => {
        let info = routeData.route[item];
        let fullPath = path.join(routeData.rootPath, item);
        let proxyFn = async function (req, res) {
          await info.fn.apply(this, [req, res, context]);
        };
        if (info.method === "GET") {
          router.get(fullPath, proxyFn);
        } else if (info.method === "POST") {
          router.post(fullPath, proxyFn);
        } else if (info.method === "DELETE") {
          router.post(fullPath, proxyFn);
        } else if (info.method === "OPTIONS") {
          router.options(fullPath, proxyFn);
        } else if (info.method === "ALL") {
          router.all(fullPath, proxyFn);
        }
      });
    }
  }

  async listen(port, ip) {
    await this.engine.app.run(port, ip);
  }
}
