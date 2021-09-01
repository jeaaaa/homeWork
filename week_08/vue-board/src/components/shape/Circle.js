import Shape from "./Shape.js";

export default class Circle extends Shape {
  constructor(context, rect, socket) {
    super(context, rect, socket);
  }

  draw() {
    let { context, style, shapes } = this;
    context.strokeStyle = "#" + style.color;
    context.lineWidth = style.linewidth;

    shapes.forEach((shape) => {
      let start = shape[0];
      let end = shape[shape.length - 1];

      var x = (start.x + end.x) / 2;
      var y = (start.y + end.y) / 2;
      var radius =
        Math.max(Math.abs(end.x - start.x), Math.abs(end.y - start.y)) / 2;
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2, false);
      context.closePath();
      context.stroke();
    });
  }

  syncData(shape) {
    console.log("syncData>> Circle");
    this.shapes.push(shape);
  }

  sendData(shape) {
    this.socket.emit("draw", { shape: "Circle", data: shape });
  }
}
