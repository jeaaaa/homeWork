module.exports = {
  devServer: {
    disableHostCheck: true,
    host: "0.0.0.0",
    port: 8080,
    // allowedHosts: "all",
    https: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
      "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
    },
    proxy: {
      "^/project": {
        target: "http://localhost:5000/",
        changeOrigin: true,
        // pathRewrite: {
        //   "/device": "",
        // },
      },
    },
  },
  transpileDependencies: ["common"],
  chainWebpack: (config) => {
    config.plugin("define").tap((args) => {
      console.log(args[0]["process.env"]);
      return args;
    });
  },
};
