import Shape from "./Shape.js";

export default class Ellipse extends Shape {
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

      const w = end.x - start.x;
      const h = end.y - start.y;
      var kappa = 0.5522848;
      const hw = w / 2;
      const hh = h / 2;

      context.beginPath();
      context.moveTo(start.x, start.y);
      context.bezierCurveTo(
        start.x,
        start.y - hh,
        end.x,
        start.y - hh,
        end.x,
        start.y
      );
      context.bezierCurveTo(
        end.x,
        start.y + hh,
        start.x,
        start.y + hh,
        start.x,
        start.y
      );
      context.closePath();
      context.stroke();
    });
  }

  syncData(shape) {
    console.log("syncData>> Ellipse");
    this.shapes.push(shape);
  }

  sendData(shape) {
    this.socket.emit("draw", { shape: "Ellipse", data: shape });
  }
}
