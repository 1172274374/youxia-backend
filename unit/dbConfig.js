var mysql = require('mysql')
module.exports = {
    config:{
        host:'rsz12321123.mysql.rds.aliyuncs.com',     //阿里鱼主机地址
        user:'',    //用户名
        password:'',    //密码
        database:'ran',     //数据库
        port:'8080'     //公网端口
    },
    query:function(sql,sqlArr,callBack){
        var pool = mysql.createPool(this.config)
        pool.getConnection(function(err,conn){
            if(err){
                console.log(err);
            }
            conn.query(sql,sqlArr,callBack)
            conn.release()
        })
    },
    promiseQuery:function(pissql,sqlArry){
        return new Promise((resolve,reject)=>{
            var pool = mysql.createPool(this.config)
            pool.getConnection(function(err,conn){
                if(err){
                    reject(err)
                }else{
                    conn.query(pissql,sqlArry,(err,data)=>{
                        if(err){
                            reject(err)
                        }else{
                            resolve(data)
                        }
                        conn.release()
                    }) 
                }
            })
        }).catch((err)=>{
            console.log(err);
        })
    }
}