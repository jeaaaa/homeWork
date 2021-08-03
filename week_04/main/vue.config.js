module.exports = {
  lintOnSave: false,
  devServer: {
    port: 8090,
  },
  transpileDependencies: ['common'],
  chainWebpack: config => {
    config.plugin('html')
      .tap((args) => {
        args[0].title = 'qiankun-example'
        return args
      })
  }
}
