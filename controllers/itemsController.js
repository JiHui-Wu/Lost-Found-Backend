

const LostItem = require('../models/LostItem');
const FoundItem = require('../models/FoundItem');
const upload=require('../utils/upload')
// 获取所有失物信息（公开）
exports.getAllLostItems = async (req, res) => {
    try {
        const lostItems = await LostItem.find();
        res.status(200).json(lostItems);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// 获取所有寻物信息（公开）
exports.getAllFoundItems = async (req, res) => {
    try {
        const foundItems = await FoundItem.find();
        res.status(200).json(foundItems);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};



exports.publishFoundItem = [
    upload.single('image'),
    async (req, res) => {
        try {
            const { item_name, location, time, description, contact_info } = req.body;
            const image_path = req.file ? req.file.path : '';
            const newFoundItem = new FoundItem({
                user_id: req.user._id,
                email: req.user.email,
                item_name,
                location,
                found_time: time,
                description,
                image_path,
                contact_info
            });
            await newFoundItem.save();
            res.status(201).json({ message: 'Found item published successfully', newFoundItem });
        } catch (error) {
            res.status(500).json({ message: 'Server Error', error });
        }
    }
];

exports.publishLostItem = [
    upload.single('image'),
    async (req, res) => {
        try {
            const { item_name, location, time, description, contact_info } = req.body;
            const image_path = req.file ? req.file.path : '';
            const newLostItem = new LostItem({
                user_id: req.user._id,
                email: req.user.email,
                item_name,
                location,
                lost_time: time,
                description,
                image_path,
                contact_info
            });
            await newLostItem.save();
            res.status(201).json({ message: 'Lost item published successfully', newLostItem });
        } catch (error) {
            res.status(500).json({ message: 'Server Error', error });
        }
    }
];

// 获取当前用户发布的失物信息（需要登录）
exports.getMyLostItems = async (req, res) => {
    try {
        // 使用user_email查找
        const myLostItems = await LostItem.find({ email: req.user.email });
        res.status(200).json(myLostItems);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// 获取当前用户发布的寻物信息（需要登录）
exports.getMyFoundItems = async (req, res) => {
    try {
        // 使用user_email查找
        const myFoundItems = await FoundItem.find({ email: req.user.email });
        res.status(200).json(myFoundItems);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

exports.deleteItem = async (req, res) => {
    try {
        const { itemId, itemType } = req.params;
        const model = itemType === 'lost' ? LostItem : FoundItem;

        const item = await model.findById(itemId);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // 可以添加更多逻辑来验证用户是否有权删除此物品
        // 例如，检查 item.user_id 与 req.user._id 是否匹配

        await model.findByIdAndDelete(itemId);
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};
