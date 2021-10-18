//依赖注入，劫持方法，当方法调用时，修改方法参数，进行动态注入
export function injectParams(context, className, method, args) {
  console.log("我是方法>>>", className, method);
  let origins = [...args];
  if (context.injects[className] && context.injects[className][method]) {
    let maps = context.injects[className][method];
    Object.keys(maps).forEach((item) => {
      let idx = parseInt(item);
      let [injectName, options] = maps[item];
      console.log("injectParams>>>>>", injectName, options);
      if (!context.provides[injectName]) {
        throw new Error(`${injectName} is not provided`);
      }
      origins[idx] = new context.provides[injectName](options);
    });
  }
  return origins;
}

// 重新定义类的所有方法，处理依赖注入
export function reDefineAllMethods(context, target, bindContext) {
  let className = target.name;
  let enumNames = Object.getOwnPropertyNames(target.prototype);
  enumNames.forEach((name) => {
    let descriptor = Object.getOwnPropertyDescriptor(target.prototype, name);
    if (typeof descriptor.value === "function") {
      //如果方法没有被重新定义过
      if (
        !context.methodsMap[className] ||
        !context.methodsMap[className][name]
      ) {
        //重新定义方法
        descriptor.value = function () {
          //处理依赖注入
          console.log("我是新定义方法", key);
          let args = injectParams(context, className, key, arguments);
          return originDescriptor.apply(this, args);
        }.bind(bindContext);
        // Object.defineProperty(target.prototype, name, descriptor);
      }
    }
  });
}
