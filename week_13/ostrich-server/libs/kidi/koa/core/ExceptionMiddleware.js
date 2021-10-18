import Exception from "./Exception";
export default class ExceptionMiddleware {
  constructor(exceptions) {
    this.exceptions = exceptions;
  }

  async use(ctx, res, next) {
    let ExceptionError =
      this.exceptions.length > 0 ? this.exceptions[0] : Exception;
    process.on("uncatchException", (err) => {
      new ExceptionError(500, "uncatchException", err.stack).pipe(ctx, res);
    });
    process.on("unhandledRejection>>>>", (err) => {
      new ExceptionError(500, "unhandledRejection", err.stack).pipe(ctx, res);
    });

    try {
      await next();
    } catch (err) {
      let code = 500;
      if (!err instanceof Exception) {
        code = err.code;
      }
      new ExceptionError(code, err.message, err.stack).pipe(ctx, res);
    }
  }
}
