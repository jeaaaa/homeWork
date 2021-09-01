export default class Shape {
  constructor(context, rect, socket, style) {
    this.context = context;
    this.width = rect.width;
    this.height = rect.height;
    this.left = rect.left;
    this.top = rect.top;

    this.startDrawing = false;
    this.startX = 0;
    this.startY = 0;
    this.endX = 0;
    this.endY = 0;

    this.shapes = [];
    this.currentShape = [];
    this.socket = socket;

    this.style = style || {
      color: "0000F0",
      lineWidth: 20,
    };
  }

  mouseup(evt) {
    this.startDrawing = false;
    this.endX = evt.clientX - this.left;
    this.endY = evt.clientY - this.top;
    this.currentShape.push({
      x: this.endX,
      y: this.endY,
    });
    this.sendData(this.currentShape);
  }

  mousedown(evt) {
    this.startDrawing = true;
    this.startX = evt.clientX - this.left;
    this.startY = evt.clientY - this.top;
    this.currentShape = [];
    this.currentShape.push({
      x: this.startX,
      y: this.startY,
    });
    this.shapes.push(this.currentShape);
  }

  mousemove(evt) {
    if (this.startDrawing) {
      this.endX = evt.clientX - this.left;
      this.endY = evt.clientY - this.top;
      this.currentShape.push({
        x: this.endX,
        y: this.endY,
      });
      this.draw();
    }
  }
}
