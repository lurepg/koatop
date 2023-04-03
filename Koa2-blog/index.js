const Koa = require('koa');
const path = require('path') //路径
const bodyParser = require('koa-bodyparser'); //用来处理post请求，一般表单会用到post请求
const ejs = require('ejs');
const session = require('koa-session-minimal'); //// 创建session缓存
const MysqlStore = require('koa-mysql-session'); //// 缓存在数据库里面进行进行操作
const config = require('./config/default.js'); //链接数据库
const router = require('koa-router') //// 路由中间件
const views = require('koa-views') //koa-views是一个koa的模板渲染中间件，使用koa-views中间件，可以和其它的模板引擎一起结合使用。也就是可以在Koa里使用模板引擎生成html页面，然后返回给到客户端
    //// 配置静态资源中间件 可以设置多个。中间件内部做了处理如果在该文件找不到资源，会继续往下处理
    // const koaStatic = require('koa-static')
const staticCache = require('koa-static-cache') //__dirname是当前文件夹
const app = new Koa()


// session存储配置
const sessionMysqlConfig = {
    user: config.database.USERNAME,
    password: config.database.PASSWORD,
    database: config.database.DATABASE,
    host: config.database.HOST,
}

// 配置session中间件
app.use(session({
    key: 'USER_SID',
    store: new MysqlStore(sessionMysqlConfig)
}))


// 配置静态资源加载中间件
// app.use(koaStatic(
//   path.join(__dirname , './public')
// ))
// 缓存
app.use(staticCache(path.join(__dirname, './public'), { dynamic: true }, {
    maxAge: 365 * 24 * 60 * 60
}))
app.use(staticCache(path.join(__dirname, './images'), { dynamic: true }, {
    maxAge: 365 * 24 * 60 * 60
}))

// 配置服务端模板渲染引擎中间件
app.use(views(path.join(__dirname, './views'), {
    extension: 'ejs'
}))
app.use(bodyParser({
    formLimit: '1mb'
}))

//  路由
app.use(require('./routers/signin.js').routes())
app.use(require('./routers/signup.js').routes())
app.use(require('./routers/posts.js').routes())
app.use(require('./routers/signout.js').routes())


app.listen(config.port)

console.log(`listening on port ${config.port}`)