// controllers/announcementController.js
const Announcement = require('../models/Announcement');

// 创建公告
exports.createAnnouncement = async (req, res) => {
    const { title, content } = req.body;
    try {
        const newAnnouncement = new Announcement({ title, content });
        await newAnnouncement.save();
        res.status(201).json({ message: '公告创建成功', announcement: newAnnouncement });
    } catch (error) {
        res.status(500).json({ message: '创建公告时发生错误', error });
    }
};

// 获取所有公告
exports.getAllAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find().sort({ createdAt: -1 });  // 按创建时间降序
        res.status(200).json(announcements);
    } catch (error) {
        res.status(500).json({ message: '获取公告时发生错误', error });
    }
};

// 删除公告
exports.deleteAnnouncement = async (req, res) => {
    const { id } = req.params;
    try {
        const announcement = await Announcement.findByIdAndDelete(id);
        if (!announcement) {
            return res.status(404).json({ message: '没有找到该公告' });
        }
        res.status(200).json({ message: '公告删除成功' });
    } catch (error) {
        console.error('Error deleting announcement:', error);
        res.status(500).json({ message: '删除公告时发生错误', error: error.message });
    }
};
// 更新公告
exports.updateAnnouncement = async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    try {
        const updatedAnnouncement = await Announcement.findByIdAndUpdate(
            id,
            { title, content },
            { new: true }  // 返回更新后的文档
        );

        if (!updatedAnnouncement) {
            return res.status(404).json({ message: '公告未找到' });
        }

        res.status(200).json({ message: '公告更新成功', announcement: updatedAnnouncement });
    } catch (error) {
        res.status(500).json({ message: '更新公告时发生错误', error: error.message });
    }
};