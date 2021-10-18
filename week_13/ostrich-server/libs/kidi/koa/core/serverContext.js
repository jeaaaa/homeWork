import Exception from "./Exception";
export default class ServerContext {
  constructor(app) {
    this.app = app;

    this.guards = [];
    this.middlewares = [];
    this.interceptors = [];
    this.exceptions = [];
    this.pipes = [];
    this.schedules = [];
  }

  middleware(middlewareClass) {
    this.middlewares.push(middlewareClass);
    return this;
  }

  guard(guardClass) {
    this.guards.push(guardClass);
    return this;
  }

  interceptor(interceptorClass) {
    this.interceptors.push(interceptorClass);
    return this;
  }

  pipe(pipeClass) {
    this.pipes.push(pipeClass);
    return this;
  }

  exception(exceptionClass) {
    this.exceptions.push(exceptionClass);
    return this;
  }

  schedule(scheduleClass) {
    this.schedules.push(scheduleClass);
    return this;
  }
}
