<template>
  <el-config-provider :locale="locale">
    <div class="flex page">
      <div class="menu-area">
        <Sidebar />
      </div>
      <div class="flex flex-auto flex-col">
        <div><Header /></div>
        <div id="subapp-viewport"><router-view></router-view></div>
      </div>
    </div>
  </el-config-provider>
</template>

<script>
// @ is an alias to /src
import Header from "@/components/Header.vue";
import Sidebar from "@/components/Sidebar.vue";
import zhCn from "element-plus/lib/locale/lang/zh-cn";

export default {
  name: "Home",
  components: {
    Header,
    Sidebar,
  },
  data() {
    return {
      locale: zhCn,
    };
  },
};
</script>

<style lang="less">
* {
  box-sizing: border-box;
}
</style>

<style lang="less" scoped>
.page {
  height: 100vh;
  .menu-area {
    height: 100vh;
  }
}
#subapp-viewport {
  flex: 1;
  overflow: auto;
}
</style>
