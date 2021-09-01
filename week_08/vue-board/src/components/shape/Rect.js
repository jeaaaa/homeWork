import Shape from "./Shape.js";

export default class Rect extends Shape {
  constructor(context, rect, socket) {
    super(context, rect, socket);
  }

  draw() {
    let { context, width, height, style, shapes } = this;
    context.strokeStyle = "#" + style.color;
    context.lineWidth = style.linewidth;

    shapes.forEach((shape) => {
      let start = shape[0];
      let end = shape[shape.length - 1];
      const w = end.x - start.x;
      const h = end.y - start.y;
      context.strokeRect(start.x, start.y, w, h);
    });
  }

  syncData(shape) {
    console.log("syncData>> Rect");
    this.shapes.push(shape);
  }

  sendData(shape) {
    this.socket.emit("draw", { shape: "Rect", data: shape });
  }
}
