var express= require('express')
var router = require('./route/router')
var app = express()
var session = require('express-session');
var path = require('path')
const cookieParser = require('cookie-parser')
var signStr = 'xadsafeowirw'



//post 请求
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cookieParser(signStr))
    
//session配置
app.use(session({
    resave: true, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: 'admin', //密钥
    name: 'testapp', //这里的name值得是cookie的name，默认cookie的name是：connect.sid
    cookie: {
      maxAge: 86400000
    } //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
  }));



// app.use(function(req, res, next) {
//     if (!req.session.user) {
//       if (req.url == "/login") {
//         next(); //如果请求的地址是登录则通过，进行下一个请求
//       } else {
//         res.redirect('/login');//跳转到登录页面
//       }
//     } else if (req.session.user) {
//       next();//如果已经登录，则可以进入
//     } 
// });

app.use(router)
app.engine('html',require('express-art-template'))
// app.use('/public/',express.static(path.join(__dirname,'/public')))
app.use('/node_modules/',express.static('./node_modules'))
app.use('/files/',express.static('./static'));


app.use('/public/',express.static(path.join(__dirname,'/public')))
app.use(express.static(path.join(__dirname,'/public')))


    


app.listen(5000,function(){
  console.log('success --> http://localhost:5000')
})
