const multer = require("multer");

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


module.exports = upload