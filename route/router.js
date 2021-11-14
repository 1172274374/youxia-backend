var express = require('express')
var app = express()
var dbconfig = require('../unit/dbConfig')
var crypto = require('../unit/cypto')
var formidable = require('formidable')
var path = require('path')
const joi = require('../unit/joi')


app.set('views',express.static('../views'))

var router = express.Router()



router.get('/',function(req,res){
    res.render('index.html')
    
})

router.get('/index',function(req,res){
    var sql = 'select * from banji'
    var sql1 = 'insert into banji(name,sex,birthday) values(?,?,?)'
    var sql2 = 'select * from banji where name=?'
    var sqlArr = []
    var name = req.query.name
    var sex = req.query.sex
    var birthday = req.query.birthday
    var sqlArr1 = [name,sex,birthday]
    var sqlArr2 = [name]
    var hhh = dbconfig.sqlConnect(sql2,sqlArr2)
    console.log(hhh == true);
    if(hhh != true){
        dbconfig.sqlConnect(sql1,sqlArr1)
    }
    dbconfig.sqlConnect(sql,sqlArr,function(err,data){
        if(err){
            console.log(err);
        }else{
            res.render('index.html',{
                data:data
            })
        }
    })
})

router.get('/mysql_text',async function(req,res){
    var value = req.query.page
    var data_length = null
    var sql = 'select * from banji where id=?'
    var sql1 = 'select * from banji'
    var sqlArr1 = []
    var sqlArr = [value]
    dbconfig.sqlConnect(sql,sqlArr,(err,data)=>{
        if(err){
            console.log(err);
        }else{
            res.render('mysql_text.html',{
                value:value,
                data:data
            })
        }
    })
    if(value == '' || value == null){
        value =1
    }
})

router.get('/text1/:name/:age/:sex',function(req,res){
    var name = req.params.name
    var age = req.params.age
    var sex = req.params.sex
    res.render('text1.html',{
        data:{
            name:name,
            age:age,
            sex:sex
        }
    })
    
})

router.post('/posttest',function(req,res){
    res.render('posttest.html')
    console.log(req.session);
    console.log(req.body.name);
})



router.get('/login', async function(req, res) {
    res.render("login.html");
    var username = '1232131'
    var password = '1243433'
    var value = joi.yanzhen(username,password)
    value.then((err,data)=>{
        if(err){
            console.log(err);
        }else{
            console.log(data);
        }
    })
});


router.post('/login', function(req, res) {
    if (req.body) {//判断时候有传值
      var user = {
        'username': req.body.username//获取用户名并赋值，这里之前可以自己做判断
      };
      req.session.user = user;//赋值session，自动跳转页面
      res.redirect('/admin')
    } else {
      res.redirect('/login');
    }
    
});

router.get('/admin', async function(req, res) {//做的登出页面

    var sql = 'select * from game where id=2' 
    var sqlArr = []

    dbconfig.sqlConnect(sql,sqlArr,(err,data)=>{
      if(err){
          console.log(err);
      }else{
          console.log(data);
          res.render('admin.html',{
              data:{
                  id:data[0].id,
                  game_title:data[0].game_title,
                  game_introduction:data[0].game_introduction,
                  game_configuration:data[0].game_configuration.split(',')
              }
          })
      }
    })

});


router.get('/logout', function(req, res) {//做的登出页面
    req.session.user = null;
    res.redirect('login');
});

router.get('/text1', async function(req, res) {//做的登出页面
    value = path.join(__dirname,'../public/img')
    sql = 'select * from game'
    sqlArr = []
    var page = req.query.page
    if(page == undefined){
        return res.render('text1.html',{
            data:{
                game_img:'404.jpg'
            }
        })
    }
    dbconfig.sqlConnect(sql,sqlArr,(err,data)=>{
        if(err){
            console.log(err);
        }else{
            var value = page<0||page>data.length||page == '' ? data[0] : data[page-1]

            return res.render('text1.html',{
                        data:{
                            id:value.id,
                            game_title:value.game_title,
                            game_introduction:value.game_introduction,
                            game_configuration:value.game_configuration,
                            game_imgs:value.game_imgs.split(',')
                        }
            })
        }
    })
});

module.exports = router