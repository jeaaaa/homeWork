
const Koa = require('koa')
const path = require('path');
const app = new Koa()
// 引入connect

const bodyParser = require('koa-bodyparser')
const cors = require('koa2-cors')   //跨域
const Router = require('koa-router')
let router = new Router()


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
    console.log('233')
})