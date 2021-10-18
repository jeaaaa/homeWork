import context from "../koa/core/context.js";

function Inject(injectName, options) {
  if (!injectName) {
    throw new Error(`inject name should not be null`);
  }
  return function (target, method, parameterIndex) {
    let className = target.constructor.name;
    if (!context.injects[className]) {
      context.injects[className] = {};
      context.injects[className][method] = {};
    }
    context.injects[className][method][parameterIndex] = [injectName, options];
  };
}

function inject(injectName, options) {
  console.log("inject>>>", injectName);
  if (!injectName) {
    throw new Error(`inject name should not be null`);
  }
  if (!context.provides[injectName]) {
    throw new Error(`${injectName} is not provided`);
  }
  return new context.provides[injectName](options);
}

function injectClass(injectName) {
  console.log("inject>>>", injectName);
  if (!injectName) {
    throw new Error(`inject name should not be null`);
  }
  if (!context.provides[injectName]) {
    throw new Error(`${injectName} is not provided`);
  }
  return context.provides[injectName];
}

export { Inject, inject, injectClass };
