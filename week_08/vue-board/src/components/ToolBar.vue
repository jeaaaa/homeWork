<template>
  <div class="tool-bar">
    <span
      v-for="tool in tools"
      :key="tool.name"
      :class="tool.name === active ? 'active' : ''"
      @click="doSelect(tool)"
      >{{ tool.text }}</span
    >
  </div>
</template>

<script>
export default {
  name: "ToolBar",
  data() {
    return {
      tools: [
        { name: "select", text: "选择" },
        { name: "pen", text: "钢笔" },
        { name: "line", text: "直线" },
        { name: "text", text: "文字" },
        { name: "rect", text: "矩形" },
        { name: "circle", text: "圆形" },
        { name: "ellipse", text: "椭圆" },
      ],
      active: "select",
    };
  },
  methods: {
    doSelect(item) {
      this.active = item.name;
      this.$emit("toolChange", item.name);
    },
  },
};
</script>

<style lang="less" scoped>
.tool-bar {
  width: 100%;
  height: 60px;
  background-color: #444;
  display: flex;
  align-items: center;
  padding: 20px;
  span {
    width: 60px;
    height: 40px;
    line-height: 40px;
    background-color: #555;
    border-radius: 4px;
    margin-right: 10px;
    color: #ccc;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
  }
  .active {
    background-color: rgb(124, 118, 248);
  }
}
</style>
