const multer = require('multer');
const path = require('path');

// 配置存储位置和文件名
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // 设置上传目录
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // 设置文件名
    }
});

// 创建 Multer 实例并配置存储
const upload = multer({ storage: storage });

module.exports = upload;

