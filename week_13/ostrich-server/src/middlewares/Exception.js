export default class Exception {
  constructor(code, message, stack) {
    this.code = code;
    this.message = message;
    this.stack = stack;
  }

  pipe(res) {
    console.log("do with Exception>>>");
    res.status(this.code);
    res.end({
      code: this.code,
      message: this.message,
      result: this.stack.toString(),
    });
  }
}
