const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    senderEmail: { type: String, required: true },
    receiverEmail: { type: String, required: true, ref: 'User' },
    content: { type: String, required: true },
    item: { type: mongoose.Schema.Types.ObjectId, required: true },
    itemType: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;