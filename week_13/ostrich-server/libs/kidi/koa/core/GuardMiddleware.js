import Exception from "./Exception";
export default class GuardMiddleware {
  constructor(guards) {
    this.guards = guards;
  }

  use(req, res, next) {
    for (let guardClass of this.guards) {
      let instance = new guardClass();
      if (!instance.activate) {
        new Exception(
          400,
          `Guard class [${guardClass.name}.js] must have an 'activate' method`
        ).pipe(res);
        return;
      }

      if (!instance.activate.apply(this, req)) {
        new Exception(400, "Guard Middleware reject the request").pipe(res);
        // return res.end("Guard Middleware reject the request");
        return;
      }
    }
    next();
  }
}
