import Shape from "./Shape.js";

export default class Pen extends Shape {
  constructor(context, rect, socket) {
    super(context, rect, socket);
  }

  draw() {
    let { context, style, shapes } = this;
    context.strokeStyle = "#" + style.color;
    context.lineWidth = style.linewidth;
    context.lineJoin = "round";

    shapes.forEach((shape) => {
      let start = shape[0];
      let end = shape[shape.length - 1];
      context.beginPath();
      context.moveTo(start.x, start.y);
      for (let i = 1; i < shape.length - 2; i++) {
        let point = shape[i];
        context.lineTo(point.x, point.y);
      }
      context.stroke();
      context.closePath();
    });
  }

  syncData(shape) {
    console.log("syncData>> Pen");
    this.shapes.push(shape);
  }

  sendData(shape) {
    this.socket.emit("draw", { shape: "Pen", data: shape });
  }
}
