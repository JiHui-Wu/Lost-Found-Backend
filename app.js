// app.js

const express = require('express');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const itemsRouter = require('./routes/items');
const permissionsRouter = require('./routes/permissions');
const articleRouter=require('./routes/article');
const commentRouter=require('./routes/comment');
const path = require('path');
const app = express();
const cors = require('cors');
const upload=require('./utils/upload')
// 解析请求体
app.use(express.json());
app.use(cors())
// 不需要用户登录就可以访问的路由
app.use('/api/items', itemsRouter);
//前端可以通过url直接访问到图片
app.use('/uploads', express.static('uploads'));


// 需要用户登录才能访问的路由
// 可以在itemsRouter内部对需要认证的路由单独应用authenticateUser中间件
app.use('/api/users', usersRouter);
app.use('/api/permissions', permissionsRouter);
const messageRouter = require('./routes/message'); // 引入 message 路由
app.use('/api/messages', messageRouter); // 挂载 message 路由
const announcementRouter = require('./routes/announcementRoutes');

// 挂载公告路由，确保这里的路径不与其他路由冲突
app.use('/api/announcements', announcementRouter);
app.use('/api/articles', articleRouter); // 挂载文章路由
app.use('/api/comments', commentRouter); // 挂载评论路由

//文件上传和下载的路由
const fileRouter = require('./routes/fileRoutes');
app.use('/api/files', fileRouter);
// 连接到 MongoDB 数据库
mongoose.connect('mongodb://localhost:27017/lost-and-found', {
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(error => {
    console.error('Error connecting to MongoDB:', error);
});
// 错误处理中间件
const errorHandler = (err, req, res, next) => {
    // 发送适当的错误响应给客户端
    res.status(500).json({
        message: 'Server Error',
        error: err.message
    });
};

// 将错误处理中间件添加到 Express 应用程序中
app.use(errorHandler);

module.exports = app;
