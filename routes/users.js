// routes/users.js

const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const { authenticateUser } = require('../middleware/authentication'); // 导入 authenticateUser 中间件

// 用户注册
router.post('/register', usersController.registerUser);

// 用户登录
router.post('/login', usersController.loginUser);

//获取个人资料
router.get('/profile', authenticateUser, usersController.getUserProfile);
//更新个人资料
router.put('/profile', authenticateUser, usersController.updateUserProfile);

module.exports = router;

