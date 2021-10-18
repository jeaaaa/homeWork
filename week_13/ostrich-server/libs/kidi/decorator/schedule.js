import context from "../koa/core/context.js";

function Schedule(scheduleClass) {
  return function (target) {
    //保存controllr的路由和类
    if (!context.schedules[target.name]) {
      context.schedules[target.name] = [];
    }
    context.schedules[target.name].push(scheduleClass);
  };
}

function Cron(cronExp) {
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
    if (!context.schedule[className]) {
      context.schedule[className] = { jobs: {} };
    }
    //保存exec方法信息
    context.schedule[className].jobs[cronExp] = descriptor.value;
  };
}

export { Schedule, Cron };
