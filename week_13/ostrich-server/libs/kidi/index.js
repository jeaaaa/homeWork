import KoaApplication from "./koa/index.js";

class Factory {
  constructor() {
    if (new.target) {
      throw new Error("Singleton pattern class, new is not allowed");
    }
  }

  static create(target, options) {
    if (target.name === "KoaApplication") {
      return new KoaApplication(options);
    }
  }
}

export { Factory, KoaApplication };
export {
  Controller,
  Get,
  Post,
  Delete,
  Options,
  All,
  Guard,
  Interceptor,
  Pipe,
  Exception,
  Schedule,
  Cron,
  Provide,
  Inject,
  inject,
  injectClass,
} from "./decorator";
