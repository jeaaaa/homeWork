import context from "../koa/core/context.js";
// import { reDefineAllMethods } from "./utils.js";

function Provide(provideName) {
  if (!provideName) {
    throw new Error(`provide name should not be null`);
  }
  console.log("✅ Provide>", provideName);
  return function (target) {
    if (context.provides[provideName]) {
      throw new Error(`${provideName} already exist!`);
    }
    context.provides[provideName] = target;
    // //重新定义所有方法，处理依赖注入
    // reDefineAllMethods(context, target, this);
  };
}

export { Provide };
