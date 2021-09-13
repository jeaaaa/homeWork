import { RouteRecordRaw, createRouter, createWebHashHistory } from "vue-router";
import { eleComponents } from "../constants";
import Home from "../views/Home.vue";

let routes: RouteRecordRaw[] = [{ path: "/", name: "Home", component: Home }];

routes = routes.concat(
  eleComponents.map((item) => {
    return {
      path: `/${item[0].replace(/^\w/, (s0) => s0.toLowerCase())}`,
      name: item[1],
      component: () => import(`../views/${item[0]}.vue`),
    };
  })
);

export default createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHashHistory(),
  routes, // `routes: routes` 的缩写
});
