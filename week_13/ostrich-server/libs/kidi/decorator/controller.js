import context from "../koa/core/context.js";
import { injectParams, reDefineAllMethods } from "./utils.js";

function Controller(rootPath) {
  return function (target) {
    //保存controllr的路由和类
    if (!context.routers[target.name]) {
      context.routers[target.name] = {};
    }
    context.routers[target.name].rootPath = rootPath;
    target.__type__ = true;
    // //重新定义所有方法，处理依赖注入
    // reDefineAllMethods(context, target, this);
  };
}

function Get(routePath) {
  return function (target, key, descriptor) {
    let className = target.constructor.name;

    const originDescriptor = descriptor.value;
    //如果是类方法，重新定义
    if (typeof originDescriptor === "function") {
      descriptor.value = function () {
        // let args = injectParams(context, className, key, arguments);
        return originDescriptor.apply(this, arguments);
      }.bind(this);
    }
    if (!context.routers[className]) {
      context.routers[className] = { route: {} };
    }
    //保存Get方法信息
    context.routers[className].route[routePath] = {
      method: "GET",
      fn: descriptor.value,
    };
    //更新方法map的状态
    // if (!context.methodsMap[className]) {
    //   context.methodsMap[className] = {};
    // }
    // context.methodsMap[className][key] = true;
  };
}

function Post(routePath) {
  return function (target, key, descriptor) {
    let className = target.constructor.name;
    const originDescriptor = descriptor.value;
    //如果是类方法，重新定义
    if (typeof originDescriptor === "function") {
      descriptor.value = function () {
        // let args = injectParams(context, className, key, arguments);
        return originDescriptor.apply(this, arguments);
      }.bind(this);
    }
    //保存Post方法信息
    if (!context.routers[className]) {
      context.routers[className] = { route: {} };
    }
    context.routers[className].route[routePath] = {
      method: "POST",
      fn: descriptor.value,
    };
    //更新方法map的状态
    // if (!context.methodsMap[className]) {
    //   context.methodsMap[className] = {};
    // }
    // context.methodsMap[className][key] = true;
  };
}

function Delete(routePathroutePath) {
  return function (target, key, descriptor) {
    let className = target.constructor.name;
    const originDescriptor = descriptor.value;
    //如果是类方法，重新定义
    if (typeof originDescriptor === "function") {
      descriptor.value = function () {
        // let args = injectParams(context, className, key, arguments);
        return originDescriptor.apply(this, arguments);
      }.bind(this);
    }
    //保存Delete方法信息
    if (!context.routers[className]) {
      context.routers[className] = { route: {} };
    }
    context.routers[className].route[routePath] = {
      method: "DELETE",
      fn: descriptor.value,
    };
    //更新方法map的状态
    // if (!context.methodsMap[className]) {
    //   context.methodsMap[className] = {};
    // }
    // context.methodsMap[className][key] = true;
  };
}

function Options(routePath) {
  return function (target, key, descriptor) {
    let className = target.constructor.name;
    const originDescriptor = descriptor.value;
    //如果是类方法，重新定义
    if (typeof originDescriptor === "function") {
      descriptor.value = function () {
        // let args = injectParams(context, className, key, arguments);
        return originDescriptor.apply(this, arguments);
      }.bind(this);
    }
    //保存Delete方法信息
    if (!context.routers[className]) {
      context.routers[className] = { route: {} };
    }
    context.routers[className].route[routePath] = {
      method: "OPTIONS",
      fn: descriptor.value,
    };
    //更新方法map的状态
    // if (!context.methodsMap[className]) {
    //   context.methodsMap[className] = {};
    // }
    // context.methodsMap[className][key] = true;
  };
}

function All(routePath) {
  return function (target, key, descriptor) {
    let className = target.constructor.name;
    const originDescriptor = descriptor.value;
    //如果是类方法，重新定义
    if (typeof originDescriptor === "function") {
      descriptor.value = function () {
        // let args = injectParams(context, className, key, arguments);
        return originDescriptor.apply(this, arguments);
      }.bind(this);
    }
    //保存Delete方法信息
    if (!context.routers[className]) {
      context.routers[className] = { route: {} };
    }
    context.routers[className].route[routePath] = {
      method: "ALL",
      fn: descriptor.value,
    };
    //更新方法map的状态
    // if (!context.methodsMap[className]) {
    //   context.methodsMap[className] = {};
    // }
    // context.methodsMap[className][key] = true;
  };
}

export { Controller, Get, Post, Delete, Options, All };
