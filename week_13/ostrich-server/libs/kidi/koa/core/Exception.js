export default class Exception extends Error {
  constructor(code, message, stack = null) {
    super(message);
    this.code = code;
    this.message = message;
    this.stack = stack;
  }

  pipe(ctx, res) {
    let result = "";
    if (this.stack) {
      result = this.stack.toString();
    }
    ctx.response.status = this.code;
    res.end({
      message: this.message,
      result,
    });
  }
}
