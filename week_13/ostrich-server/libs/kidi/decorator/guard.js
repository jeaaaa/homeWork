import context from "../koa/core/context.js";

function Guard(guardClass) {
  return function (target) {
    if (!context.guards[target.name]) {
      context.guards[target.name] = [];
    }
    context.guards[target.name].push(guardClass);
    target.__type__ = true;
  };
}

export { Guard };
