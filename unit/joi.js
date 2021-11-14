var Joi = require('joi')


module.exports = {
    yanzhen:async function(username,password){
        var schema = Joi.object({
            username:Joi.string().min(6).max(12).required().error(new Error('username属性没有通过验证')),
            password:Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required().error(new Error('password 错误'))
        })
        try{
            var value = await schema.validateAsync({password:username,username:password})
            return value
        }catch(err){
            return err.message
            console.log(err.message);
        }
    }
}