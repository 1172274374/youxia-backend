var express = require('express')
var app = express()
var db = require('../unit/dbConfig')
var formidable = require('formidable')
var path = require('path')
const joi = require('../unit/joi')
const multer = require("multer");
const cors = require('cors')
const fs = require('fs')
const co = require('co')
const OSS = require('ali-oss')
const alipaySdk = require('../alipay/zhifubao')
const sizeOf = require('image-size') /* 获取图片相关信息 */
// const AliPaySdk = require('alipay-sdk').default
const AlipayForm = require('alipay-sdk/lib/form').default
let client = new OSS({
    region: 'oss-cn-beijing', // 公共云下OSS Region
    accessKeyId: 'LTAI5tBpzctAQ7qFM2LEqgHD', // AccessKey ID
    accessKeySecret: 'MqzfiGRfEu4iekO1j8KKVmhAeA4shN' // AccessKey Secret
});


let ali_oss = {
    bucket: 'youxiatest',	// Bucket名称
    endPoint: 'oss-cn-beijing.aliyuncs.com',	// 公共云下OSS 外网Endpoint
};

/* 获得现在的时间 */
function today() {
    let time = Date.parse(new Date());
    let date = new Date(time);
    var y=date.getFullYear();
    var m=date.getMonth()+1;
    var d=date.getDate();
    var h=date.getHours();
    var m1=date.getMinutes();
    var s=date.getSeconds();
    m = m<10?("0"+m):m;
    d = d<10?("0"+d):d;
    
    return y+"-"+m+"-"+d+" "+h+":"+m1+":"+s;
}



var Cookies = require('cookies');
 

var common = require('../unit/common')
var cypto = require('../unit/cypto')
const { resolveSoa } = require('dns')
const { func } = require('joi')



app.set('views',express.static('../views'))


var router = express.Router()

router.use(cors())

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        console.log(file);
        const uniqueSuffix = Date.now();
        
        cb(null, uniqueSuffix + "-" + '.'+file.originalname.split('.')[1]);
    },
});

const upload = multer({ storage: storage });









router.get('/',async (req,res)=>{
    
    res.render('index.html')
    

})

router.get('/login', async (req,res)=>{
    
    res.send({
        username:req.session.username||'',
        password:req.session.password||'',
        isVip:req.session.isVip||''
    })
})

router.get('/logout',async (req,res)=>{
    
    req.session.username = undefined
    req.session.password = undefined
    req.session.isVip = undefined
    
    res.send({
        username:req.session.username,
        password:req.session.password,
        isVip:req.session.isVip
    })

})


router.get('/game/:class',(req,res)=>{

    var game_class = req.params.class
    var page = req.query.page
    var sql = 'select * from '+game_class+' LIMIT ?,?'
res.render('game.html',{
                data:data,
                game_class:game_class,
                page:page,
                page_length:page_length
            })
    if(page != undefined){
        game_state = (page - 1)*8 
    }else{
        game_state = 0
        page=1
    }
    


    db.query(sql,[game_state,8],(err,data)=>{
        if(err){
            console.log(err);
        }else{
            var page_length = Math.ceil(data.length/8)
            
        }
    })
    
})

router.get('/game/:class/:id',async (req,res)=>{

    let game_class = req.params.class

    let game_id = req.params.id

    let sql = 'select * from '+game_class+' where id = ?'

    let game = await db.promiseQuery(sql,[game_id])
    
    let game_img = game[0].game_imgs.split(',')

    let game_config = game[0].game_configuration.split(',')

    let game_class_id = game_class.slice(-3).toUpperCase()

    

    res.render('game_id.html',{
        game:game,
        game_img:game_img,
        game_config:game_config,
        game_class_id:game_class_id,
        game_class:game_class
    })
    
})


router.get('/test1',async (req,res)=>{
    res.render('test/test1.html')
})

router.get('/test2',async (req,res)=>{
    let banji = await db.promiseQuery('select * from banji',[])
    res.send(banji)
})


router.post('/test3',async (req,res)=>{
    var form = new formidable.IncomingForm()
    form.parse(req, function(err, fields, files) {
        if(err){
            console.log(err);
        }
        res.send(fields)
    });
})


/* 游侠网数据库API接口 */

router.get('/youxi',async (req,res)=>{

    let game_class = Math.ceil(Math.random() * 400)
    
    let sql = `select * from youxi limit ${game_class},70`
    let data = await db.promiseQuery(sql,[])

    res.send(data)
})

router.get('/rocation',async (req,res)=>{

    let sql = 'SELECT * FROM banner ORDER BY RAND() LIMIT 5'
    let data = await db.promiseQuery(sql,[])

    res.send(data)
})

router.get('/cepin',async (req,res)=>{

    let sql = 'SELECT * FROM test ORDER BY RAND() LIMIT 5'
    let data = await db.promiseQuery(sql,[])

    res.send(data)
})

router.get('/prospect',async (req,res)=>{

    let sql = 'SELECT * FROM news ORDER BY RAND() LIMIT 9'
    let data = await db.promiseQuery(sql,[])

    res.send(data)
})

router.get('/zhixun',async (req,res)=>{
    let num = req.query.number*24
    let sql = `select * from zhixun limit ${num},24`
    let data = await db.promiseQuery(sql)

    res.send(data)
})

router.get('/introduction',async (req,res)=>{
    let num = req.query.number
    let sql = `select * from introduction order by rand() limit ${num}`
    let data = await db.promiseQuery(sql)

    res.send(data)
})

router.get('/checkUser',async (req,res)=>{
    let username = req.query.username
    let sql = `select username,isvip from login where username = ${username} limit 1`
    let data = await db.promiseQuery(sql)
    if(data[0].username != undefined){
        req.session.username = data[0].username
        req.session.isVip = data[0].isvip
    }

    res.send(data)
})

router.get('/checkPassword',async (req,res)=>{
    let password = req.query.password
    let sql = `select password from login where password = '${password}' limit 1`
    let data = await db.promiseQuery(sql)
    if(data[0].password != undefined){
        req.session.password = data[0].password
    }

    res.send(data)
})

router.get('/recentblokbusters',async (req,res)=>{
    
    let sql = 'select * from masterpiece order by id'
    let data = await db.promiseQuery(sql)
    res.send(data)
})

router.get('/newgame',async (req,res)=>{
    
    let sql = 'select * from bestnewgame order by rand() limit 6'
    let data = await db.promiseQuery(sql)
    res.send(data)
})

router.get('/buygame',async (req,res)=>{
    
    let sql = 'select * from discount_shop_game order by rand() limit 8'
    let data = await db.promiseQuery(sql)
    res.send(data)
})

router.get('/shopDetail',async (req,res)=>{
    
    if(req.query.number == undefined){
        let sql = `select * from shops where id = ${req.query.id}`
        let data = await db.promiseQuery(sql)
        res.send(data)
    }else{
        let sql = `select * from shops  order by rand() limit ${req.query.number}`
        let data = await db.promiseQuery(sql)
        res.send(data)
    }
    
    
})

router.get('/leron',async (req,res)=>{
    
    let sql = `select content from shops where id = ${req.query.id}`
    let data = await db.promiseQuery(sql)
    res.send(data)
    
    
})


//cookies 测试
router.get('/cookie_test',async (req,res)=>{
    
    const {username,password,vip}=req.query;

    var cookies = new Cookies(req, res)

    // 设置cookie('键名','值','有效期')

     cookies.set('username', username, { signed: false,maxAge:60000*60*24*7 })
     cookies.set('password', password, { signed: false,maxAge:60000*60*24*7 })
     cookies.set('vip', vip, { signed: false,maxAge:60000*60*24*7 })

     res.redirect('cookies')
    
})

router.get('/cookies',async (req,res)=>{

    var cookies = new Cookies(req, res)
    var cookie_username =  cookies.get('username', { signed: false });
    var cookie_password =  cookies.get('password', { signed: false });
    var cookie_vip = cookies.get('vip', { signed: false });
    
    if(cookie_username&&cookie_password&&cookie_vip !==undefined){
        res.setHeader('Set-Cookie',`username=${cookie_username}&password=${cookie_password}&vip=${cookie_vip};path=/`)
        res.send({
            username:cookie_username,
            passwored:cookie_password,
            vip:cookie_vip
        })
    }
    
})

router.post('/uploadFile', upload.single('file'), function (req, res, next) {
    // 文件路径
    let filePath = './' + req.file.path;

    let dimensions = sizeOf(req.file.path)      /* 获取图形宽高和类型 */

    console.log(dimensions);

    // 文件类型
    let fileType = dimensions.type
    let lastName = '.' + fileType;

    // 构建图片名
    let fileName = req.file.originalname

    // 图片重命名
    fs.rename(filePath, fileName, (err) => {
        if (err) {
            res.end({
                code: 403,
                msg: '文件写入失败'
            })
        } else {
            let user = req.body.username        /* 用户名 */
            let file_type = req.body.file_type      /* 文件类别 */

            if(dimensions.type != 'jpg' || dimensions.width > 500 || dimensions.height > 500){
                res.send({
                    code:403,
                    msg:'上传失败'
                })
            }else{

                let file_verify = file_type=='avate'?'avate':''

                let newFileName = file_verify + lastName

                let class_file = 'imgs'
                // console.log(user);

                let localFile = './' + fileName;

                // 上传到指定目录（/imgs/2021-11-27/1637994928002.jpg）
                // 将文件上传到指定目录,需要输入目录名称。
                // 若输入的目录不存在,OSS将自动创建对应的文件目录并将文件上传到该目录中。

                let key = `${user}/${class_file}/${newFileName}`;

                // 阿里云 上传文件
                co(function* () {
                    client.useBucket(ali_oss.bucket);
                    let result = yield client.put(key, localFile);
                    // 上传成功返回图片路径域名
                    let imageSrc = 'https://youxiatest.oss-cn-beijing.aliyuncs.com/' + result.name;
                    // 上传之后删除本地文件
                    fs.unlinkSync(localFile);
                    res.json({
                        code: 200,
                        msg: '上传成功',
                        imageUrl: imageSrc
                    })
                }).catch(function (err) {
                    // 上传之后删除本地文件
                    fs.unlinkSync(localFile);
                    res.json({
                        code: 403,
                        msg: '上传失败',
                        error: JSON.stringify(err)
                    })
                });
            }
        }
    });
});



router.post('/login',upload.single("file"),async (req,res)=>{

    console.log(req.file);
    res.end()

    

})
router.get('/login',async (req,res)=>{

    let date =  today()
    req.session.username = 'ranshizhang'

    // console.log(req.session);

    console.log(date);
    res.render('login.html')

})

/* 支付宝支付接口的调用 */

router.post('/api/payment',async (req,res)=>{

    const formData = new AlipayForm()
    
    let orderId = req.body.orderId
    let orderAmount= req.body.orderAmount
    let orderTitle = req.body.orderTitle
    let user = req.body.user

    let date = today()

    console.log(orderId);
    console.log(orderAmount);
    console.log(orderTitle);
    console.log(user);

    formData.setMethod('get')
    formData.addField('returnUrl', 'https://www.samisong.cn/youxia');//支付成功的回调
    formData.addField('bizContent', {
      outTradeNo: orderId, //订单号
      productCode: 'FAST_INSTANT_TRADE_PAY', //产品码
      totalAmount: orderAmount,//金额
      subject: '游戏购买', //标题
      body: orderTitle,//内容
    });
    
    //执行结果
    const result = await alipaySdk.exec('alipay.trade.page.pay',{},{ formData: formData });
    res.send({
      URL:result,
      title:orderTitle,
      orderId:orderId,
      orderAmount:orderAmount,
      user:user,
      date:date
    })
})


module.exports = router