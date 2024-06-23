// controllers/permissionsController.js

const User = require('../models/User');




exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}); // 空对象 {} 作为参数表示获取所有文档
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};


exports.deleteUser = async (req, res) => {
    try {
        const { email } = req.params; // 获取 URL 参数中的 email
        const deletedUser = await User.findOneAndDelete({ email: email });

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
