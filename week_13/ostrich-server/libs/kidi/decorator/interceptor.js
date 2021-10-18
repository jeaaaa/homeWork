import context from "../koa/core/context.js";

function Interceptor(interceptorClass) {
  return function (target) {
    if (!context.interceptors[target.name]) {
      context.interceptors[target.name] = [];
    }
    context.interceptors[target.name].push(interceptorClass);
    target.__type__ = true;
  };
}

export { Interceptor };
