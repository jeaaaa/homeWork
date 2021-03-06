import { createApp } from "vue";
import App from "./App.vue";
import routes from "./router";
import { createRouter, createWebHashHistory } from "vue-router";
import { registerMicroApps, start, setDefaultMountApp } from "qiankun";
import microApps from "./micro-app";
import ElementPlus from "element-plus";
import "element-plus/theme-chalk/index.css";

import "./assets/main.css";

const router = createRouter({
  base: "",
  history: createWebHashHistory(),
  routes,
});

const instance = createApp(App)
  .use(router)
  .use(ElementPlus, { size: "small" })
  .mount("#app");

// 定义loader方法，loading改变时，将变量赋值给App.vue的data中的isLoading
function loader(loading) {
  if (instance && instance.$refs && instance.$refs[0]) {
    // instance.$children[0] 是App.vue，此时直接改动App.vue的isLoading
    instance.$refs[0].isLoading = loading;
  }
}

// 给子应用配置加上loader方法
const apps = microApps.map((item) => {
  return {
    ...item,
    loader,
  };
});

registerMicroApps(apps, {
  beforeLoad: (app) => {
    console.log("before load app.name====>>>>>", app.name);
  },
  beforeMount: [
    (app) => {
      console.log("[LifeCycle] before mount %c%s", "color: green;", app.name);
    },
  ],
  afterMount: [
    (app) => {
      console.log("[LifeCycle] after mount %c%s", "color: green;", app.name);
    },
  ],
  afterUnmount: [
    (app) => {
      console.log("[LifeCycle] after unmount %c%s", "color: green;", app.name);
    },
  ],
});
// setDefaultMountApp("/performance");
start();
