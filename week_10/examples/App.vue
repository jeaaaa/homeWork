<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
});
</script>

<style lang="scss">
html,
body {
  padding: 0px;
  margin: 0px;
}

button {
  background: #5468ff;
  border: 1px solid #6677fa;
  border-radius: 6px;
  color: #fff;
  padding: 8px 0;
  cursor: pointer;
  font-size: 18px;
  width: 100%;
  text-align: center;
  &:hover {
    background: #6677fa;
  }
}
</style>
