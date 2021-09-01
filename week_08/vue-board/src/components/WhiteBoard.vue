<template>
  <div class="page">
    <ToolBar @toolChange="toolChange"></ToolBar>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import ToolBar from "./ToolBar.vue";
import { Circle, Line, Pen, Rect, Ellipse, Text } from "./shape/index.js";
import Shape from "./shape/Shape";

const SHAPES = {
  Circle,
  Line,
  Pen,
  Rect,
  Ellipse,
  Text,
};
let SHAPE_INSTANCES = new Map();
let socket = null;

export default {
  name: "whiteboard",
  components: {
    ToolBar,
  },
  data() {
    return {
      shape: "",
      shapeInstance: null,
      startTime: 0,
      width: 0,
      height: 0,
    };
  },
  mounted() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.width = width;
    this.height = height;
    const dom = this.$refs.canvas;
    let context = dom.getContext("2d");
    context.imageSmoothingEnabled = true;

    const devicePixelRatio = window.devicePixelRatio || 1;
    const backingStoreRatio =
      context.webkitBackingStorePixelRatio ||
      context.mozBackingStorePixelRatio ||
      context.msBackingStorePixelRatio ||
      context.oBackingStorePixelRatio ||
      context.backingStorePixelRatio ||
      1;
    let ratio = devicePixelRatio / backingStoreRatio;
    ratio = 3;
    dom.width = width * ratio;
    dom.height = height * ratio - 60;
    context.scale(ratio, ratio);
    context.clearRect(0, 0, width, height);
    this.context = context;

    function throttle(callback, delay) {
      var previousCall = new Date().getTime();
      return function () {
        var time = new Date().getTime();
        if (time - previousCall >= delay) {
          previousCall = time;
          callback.apply(null, arguments);
        }
      };
    }

    dom.addEventListener(
      "mousedown",
      (evt) => {
        if (!this.shapeInstance) return;
        this.shapeInstance.mousedown.apply(this.shapeInstance, [evt]);
      },
      false
    );
    dom.addEventListener(
      "mousemove",
      throttle((evt) => {
        if (!this.shapeInstance) return;
        this.shapeInstance.mousemove.apply(this.shapeInstance, [evt]);
      }, 30),
      false
    );
    dom.addEventListener(
      "mouseup",
      (evt) => {
        if (!this.shapeInstance) return;
        this.shapeInstance.mouseup.apply(this.shapeInstance, [evt]);
      },
      false
    );

    this.draw();
    this.setupSocket();
  },
  methods: {
    toolChange(name) {
      this.shape = name;
      if (!SHAPE_INSTANCES.has(this.shape)) {
        const className = name.replace(/^(\w)/, (s0, s1) => s1.toUpperCase());
        const pos = this.$refs.canvas.getBoundingClientRect();
        this.shapeInstance = new SHAPES[className](this.context, pos, socket);
        SHAPE_INSTANCES.set(this.shape, this.shapeInstance);
      }
      this.shapeInstance = SHAPE_INSTANCES.get(this.shape);
    },
    draw() {
      if (Date.now() - this.startTime > 1000 / 60) {
        this.context.clearRect(0, 0, this.width, this.height);
        for (let [shape, instance] of SHAPE_INSTANCES) {
          instance.draw();
        }
        this.startTime = Date.now();
      }
      window.requestAnimationFrame(this.draw);
    },
    setupSocket() {
      socket = io("http://localhost:7900", { transports: ["websocket"] });
      socket.on("connect", () => {
        // At this point we have connected to the server
        console.log("🌍 Connected to server");
      });
      socket.on("draw", (data) => {
        console.log("🌍 ", data);
        for (let [shape, instance] of SHAPE_INSTANCES) {
          console.log(shape, data.shape);
          if (shape.toLowerCase() === data.shape.toLowerCase()) {
            instance.syncData(data.data);
          }
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  canvas {
    background-color: #f0f0f0;
  }
}
</style>
