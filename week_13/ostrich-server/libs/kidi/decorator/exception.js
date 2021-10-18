import context from "../koa/core/context.js";

function Exception(exceptionClass) {
  return function (target) {
    if (!context.exceptions[target.name]) {
      context.exceptions[target.name] = [];
    }
    context.exceptions[target.name].push(exceptionClass);
    target.__type__ = true;
  };
}

export { Exception };
