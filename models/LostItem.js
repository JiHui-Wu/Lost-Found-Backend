const mongoose = require('mongoose');

const lostItemSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    email: { type: String, required: true }, // 添加email字段
    item_name: { type: String, required: true },
    location: { type: String, required: true },
    lost_time: { type: Date, required: true },
    description: { type: String, required: true },
    image_path: { type: String },
    contact_info: { type: String, required: true },
});

const LostItem = mongoose.model('LostItem', lostItemSchema);

module.exports = LostItem;
