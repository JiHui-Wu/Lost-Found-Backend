// controllers/usersController.js

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key';
const Permission = require('../models/Permission');

exports.registerUser = async (req, res) => {
    try {
        const { username, password, email, contact } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: '该邮箱已被注册' });
        }
        const newUser = new User({ username, password, email, contact });
        await newUser.save();
        res.status(201).json({ message: '注册成功！' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};



exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(400).json({ message: '账户或者密码错误' });
        }

        // 查询用户是否具有管理员权限
        const permissions = await Permission.find({ user_id: user._id });

        const isAdmin = permissions.some(permission => permission.permission_level === 'admin');

        // 创建 JWT Token，并将 isAdmin 添加到 payload 中
        const token = jwt.sign(
            { user_id: user._id, email: user.email, isAdmin },
            SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: '登录成功！',
            token,
            user: { id: user._id, username: user.username, email: user.email, isAdmin }
        });
    } catch (error) {

        res.status(500).json({ message: 'Server Error' });
    }
};


// controllers/usersController.js

exports.getUserProfile = async (req, res) => {
    try {
        // 从请求中获取用户的 email
        const userEmail = req.user.email;

        // 检查 userEmail 是否存在
        if (!userEmail) {
            return res.status(400).json({ message: 'User email is missing' });
        }

        // 通过 userEmail 查询用户信息
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // 返回当前登录用户的信息
        res.status(200).json({ user });
    } catch (error) {

        res.status(500).json({ message: 'Server Error' });
    }
};

exports.updateUserProfile = async (req, res) => {
    const userEmail = req.user.email;
    const { username, email, contact, password } = req.body;

    try {
        // 初始化更新数据，不包括密码
        const updateData = { username, email: email || userEmail, contact };

        // 如果提供了非空密码，则包括到更新数据中
        if (password && password.trim() !== "") {
            updateData.password = password;
        }

        const updatedUser = await User.findOneAndUpdate(
            { email: userEmail },
            updateData,
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: '用户信息更新成功' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};
