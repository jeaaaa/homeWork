
const Koa = require('koa')
const path = require('path');
const fs = require('fs');
const process = require('child_process');
const app = new Koa()

const bodyParser = require('koa-bodyparser')
const cors = require('koa2-cors')   //跨域
const Router = require('koa-router')
let router = new Router()

// const webpack = require('webpack');
// const WebpackDevServer = require("webpack-dev-server");
// // 读取 webpack.config.js 文件中的配置
// const config = require('./webpack.config');

router.post('/getFile', async (ctx) => {
    try {
        let data = ctx.request.body //获取到的code字符串
        await fs.writeFile('./src/index.js', data.code, (err) => {
            if (err) {
                throw err
            }
        })
        process.exec('npm run dev', (error, stdout, stderr) => {
            if (error) {
                console.log(error)
            } else {
                console.log(stdout)
                console.log(stderr)
            }
        })

        // await new Promise((resolve, reject) => {

        // }).then((res) => {
        //     console.log(res)

        // }).catch(err => console.log(err))
        // 这里子进程不知道咋写回调返回，外面里面都没有
        ctx.body = { code: 1, url: 'http://localhost:1010' }
    } catch (error) {
        ctx.body = { code: 0, message: error }
    }
})

app.use(cors({
    // allowMethods: ['GET', 'POST', 'DELETE'],
}))
app.use(bodyParser())
// 加载路由中间件
app.use(router.routes())
app.use(router.allowedMethods())

app.use(async (ctx) => {
    ctx.body = 'yes koa'
})

app.listen(8999, () => {
    console.log('server start on 8999')
})