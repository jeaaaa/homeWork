import GuardMiddleware from "./GuardMiddleware";
import PipeMiddleware from "./PipeMiddleware";
import ExceptionMiddleware from "./ExceptionMiddleware.js";

function plugin(engine, pluginClass, options) {
  let { app, router } = engine;
  let instance = new pluginClass(engine, options);
  app[instance.pluginName] = instance;
  if (instance.connect) {
    instance.connect();
  }
}

function middleware(engine, midType, middleware) {
  let { app, router } = engine;
  switch (midType) {
    case "interceptor":
      regitstInteceptor(middleware, router);
      break;
    case "middleware":
      regitstMiddleware(middleware, router);
      break;
    case "pipe":
      regitstPipe(middleware, router);
      break;
    case "guard":
      regitstGuard(middleware, router);
      break;
    case "exception":
      regitstMiddleware(middleware, router);
      break;
  }
}

//注册带路由中间件, 注册Middleware
function regitstMiddleware(classFn, router) {
  //middleware
  let mids = [];
  let instance = new classFn();
  if (instance.use && typeof instance.use === "function") {
    mids.push([instance.use, instance]);
  } else {
    throw new Exception(
      400,
      `Middleware class [${classFn.name}] must contains a 'use' function.`
    );
  }
  router.use(routeData.rootPath, mids);
}

//注册带路由中间件, 注册Interceptor
function regitstInteceptor(classFn, router) {
  let mids = [];
  let instance = new classFn();
  //interceptor
  if (instance.intercept && typeof instance.intercept === "function") {
    return [instance.intercept, instance];
  } else {
    throw new Exception(
      400,
      `Interceptor class [${classFn.name}] must contains a 'intercept' function.`
    );
  }
  router.use(routeData.rootPath, mids);
}

//注册带路由中间件, 注册Guard
function regitstGuard(classFn, router) {
  let instance = new GuardMiddleware([classFn]);
  router.use(routeData.rootPath, [[instance.use, instance]]);
}

//注册带路由中间件, 注册Pipe
function regitstPipe(classFn, router) {
  let instance = new PipeMiddleware([classFn]);
  router.use(routeData.rootPath, [[instance.use, instance]]);
}

//注册带路由中间件, 注册Exception
function regitstException(classFn, router) {
  let instance = new ExceptionMiddleware([classFn]);
  router.use(routeData.rootPath, [[instance.use, instance]]);
}

export { middleware, plugin };
