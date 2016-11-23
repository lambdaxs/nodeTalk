const express = require('express')
const path = require('path')
const config = require('config-lite')
const app = express()

//设置视图引擎为hbs
const exphbs = require('express-handlebars')
app.set('views', path.join(__dirname, 'views'))
app.engine('hbs', exphbs({
    defaultLayout:'main',
    extname: '.hbs'
}))
app.set('view engine', 'hbs')

//配置dubug日志
const favicon = require('serve-favicon')
const logger = require('morgan')
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))

//基本参数解析
const cookieParser = require('cookie-parser')
app.use(cookieParser())
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

//静态文件路径
app.use(express.static(path.join(__dirname, 'public')))

// 处理表单上传
// app.use(require('express-formidable')({
//     uploadDir: path.join(__dirname, 'public/images'),// 上传文件目录
//     keepExtensions: true,// 保留后缀
//     encoding: 'utf-8'
// }))

// session 中间件
const session = require('express-session')
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash')
app.use(session({
    name: config.session.key,// 设置 cookie 中保存 session id 的字段名称
    secret: config.session.secret,// 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
    cookie: {
        maxAge: config.session.maxAge// 过期时间，过期后 cookie 中的 session id 自动删除
    },
    resave:false,
    saveUninitialized:true,
    store: new MongoStore({// 将 session 存储到 mongodb
        url: config.mongodb// mongodb 地址
    })
}));

//flash中间件
app.use(flash());

// 设置模板全局常量
app.locals.blog = {
    title: "Lambda",
    description: "only coder"
}

//添加模板必需的三个变量
app.use((req, res, next)=> {
    res.locals.user = req.session.user
    res.locals.success = req.flash('success').toString()
    res.locals.error = req.flash('error').toString()
    next()
})

app.use((req,res,next)=>{
    req.appDir = __dirname
    next()
})

//Controller
const controller = require('./routes/controllers')
controller(app)

//处理错误
app.use((err,req, res, next) =>{
  res.render("error",{
      error:err
  })
})

module.exports = app;
