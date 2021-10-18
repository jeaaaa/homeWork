import cjs from "rollup-plugin-commonjs"; // 插件将CommonJS模块转换为 ES2015 提供给 Rollup 处理
import babel from "rollup-plugin-babel"; // es新特性的解析转换
import { terser } from "rollup-plugin-terser";
import nodeResolve from "rollup-plugin-node-resolve"; //解析node_modules 中的模块
// 1. `rollup-plugin-alias`: 配置module的别名
// 2. `rollup-plugin-babel`: 打包过程中使用Babel进行转换, 需要安装和配置Babel
// 3. `rollup-plugin-eslint`: 提供ESLint能力, 需要安装和配置ESLint

// 5. `rollup-plugin-commonjs`: 转换 CJS -> ESM, 通常配合上面一个插件使用
// 6. `rollup-plugin-replace`: 类似于webpack的DefinePlugin

module.exports = {
  input: "./src/index.js", // 输入
  output: [
    {
      // 输出es
      file: `dist/ostrich.esm.js`, // 输出的文件
      format: "es", // 输出的文件格式
      sourcemap: true,
    },
    {
      // 输出cjs
      file: `dist/ostrich.common.js`, // 输出的文件
      format: "cjs", // 输出的文件格式
      sourcemap: true,
    },
    {
      // 输出umd
      file: `dist/ostrich.umd.js`, // 输出的文件
      format: "umd", // 输出的文件格式
      name: "ostrich",
      sourcemap: true,
    },
    {
      // 输出iife
      file: `dist/ostrich.js`, // 输出的文件
      format: "iife", // 输出的文件格式
      name: "Ostrich",
      sourcemap: true,
    },
  ],
  plugins: [
    nodeResolve(),
    cjs(),
    // terser({ compress: { drop_console: true } }),
    babel({
      exclude: "node_modules/**", // 排除node_modules文件夹下的文件
    }),
  ],
};
