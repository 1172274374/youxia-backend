var mysql = require('mysql')
module.exports = {
    config:{
        host:'rsz12321123.mysql.rds.aliyuncs.com',
        user:'ranshizhang',
        password:'Rsz12321',
        database:'ran',
        port:'8080'
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