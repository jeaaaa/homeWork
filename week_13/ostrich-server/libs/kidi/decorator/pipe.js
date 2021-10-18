import context from "../koa/core/context.js";

function Pipe(pipeClass) {
  return function (target) {
    if (!context.pipes[target.name]) {
      context.pipes[target.name] = [];
    }
    context.pipes[target.name].push(pipeClass);
    target.__type__ = true;
  };
}

export { Pipe };
