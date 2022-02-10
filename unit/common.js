var crypto = require('crypto');

module.exports = {
    MD5_SUFFIX : 'JDSAIOEUQOIoieuoiqv#$%^&dhfja)(* %^&FGHJfyuieyfhfhak(^.^)YYa!!\(^o^)/Y(^o^)Y(*^__^*)ﾍ|･∀･|ﾉ*~●',
    md5:function (pwd) {
        var md5 = crypto.createHash('md5');
        return md5.update(pwd).digest('hex');
    }
};