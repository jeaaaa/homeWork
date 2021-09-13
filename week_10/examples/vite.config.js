import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { resolve } from "path";
import WindiCSS from "vite-plugin-windicss";

export default defineConfig({
    base: "", // 设置打包路径
    plugins: [vue(), vueJsx(), WindiCSS()],
    resolve: {
        alias: {
            "@": resolve(__dirname, "../packages"), // 设置 `@` 指向 `src` 目录
        },
    },
    publicDir: "public",
    build: {
        rollupOptions: {
            input: "src/pages/default/index.html",
        },
        outDir: "dist",
    },
    optimizeDeps: {
        include: ["vue", "vue-router", "@vueuse/core"],
    },
    server: {
        host: "0.0.0.0",
        port: 10086, // 设置服务启动端口号
        open: false, // 设置服务启动时是否自动打开浏览器
        cors: true, // 允许跨域
        // 设置代理，根据项目实际情况配置
        proxy: {
            "/api": {
                target: "http://xx.xx.cn/api/v1",
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace("/api/", "/"),
            },
        },
    },
});
