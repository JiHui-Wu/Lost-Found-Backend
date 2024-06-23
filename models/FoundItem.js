const mongoose = require('mongoose');

const foundItemSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    email: { type: String, required: true }, // 添加email字段
    item_name: { type: String, required: true },
    location: { type: String, required: true },
    found_time: { type: Date, required: true },
    description: { type: String, required: true },
    image_path: { type: String },
    contact_info: { type: String, required: true },
});

const FoundItem = mongoose.model('FoundItem', foundItemSchema);


module.exports = FoundItem;
