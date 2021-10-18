export default class PipeMiddleware {
  constructor(pipes) {
    this.pipes = pipes;
  }

  use(req, res, next) {
    this.pipes.reduce((result, pipeClass) => {
      let instance = new pipeClass();
      if (!instance.pipe) {
        new Exception(
          400,
          `Pipe class [${pipeClass.name}] must have an pipe method`
        ).pipe(res);
      }
      return instance.pipe.apply(this, result);
    }, req);
    next();
  }
}
