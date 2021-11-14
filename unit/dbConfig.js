var mysql = require('mysql')
module.exports = {
    config:{
        host:'rsz12321123.mysql.rds.aliyuncs.com',
        user:'ranshizhang',
        password:'Rsz12321',
        database:'ran',
        port:'8080'
    },
    sqlConnect:function(sql,sqlArr,callBack){
        var pool = mysql.createPool(this.config)
        pool.getConnection(function(err,conn){
            if(err){
                console.log(err);
            }
            conn.query(sql,sqlArr,callBack)
            conn.release()
        })
    }
}