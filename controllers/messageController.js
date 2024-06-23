const Message = require('../models/Message');
const FoundItem = require('../models/FoundItem');
const LostItem = require('../models/LostItem');
exports.sendMessage = async (req, res) => {
    const { receiverEmail, content, item, itemType } = req.body;

    if (!req.user || !req.user.email) {
        return res.status(400).json({ message: 'Sender email is missing' });
    }

    if (!receiverEmail) {
        return res.status(400).json({ message: 'Receiver email is missing' });
    }

    try {
        const newMessage = new Message({
            sender: req.user._id,  // 这里应该是发送者的 User ID
            senderEmail: req.user.email,  // 使用认证用户的email作为senderEmail
            receiverEmail,                // 使用请求体中的receiverEmail
            content,
            item,
            itemType
        });
        await newMessage.save();
        res.status(201).json({ message: 'Message sent successfully', data: newMessage });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send message', error: error.message });
    }
};

exports.getReceivedMessages = async (req, res) => {
    if (!req.user || !req.user.email) {
        return res.status(400).json({ message: 'User email is missing in the request. Authentication might have failed.' });
    }

    try {
        let messages = await Message.find({ receiverEmail: req.user.email });

        // 异步获取每个消息相关联的物品信息
        const messagesWithItemDetails = await Promise.all(messages.map(async (message) => {
            let itemDetails;
            if (message.itemType === 'found') {
                itemDetails = await FoundItem.findById(message.item);
            } else if (message.itemType === 'lost') {
                itemDetails = await LostItem.findById(message.item);
            }
            return { ...message.toObject(), itemDetails };  // 将物品信息附加到消息对象
        }));

        res.status(200).json({ messages: messagesWithItemDetails });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve messages due to an internal error.', error: error.message });
    }
};

exports.deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const deletedMessage = await Message.findByIdAndDelete(messageId);
        if (!deletedMessage) {
            return res.status(404).json({ message: 'Message not found' });
        }
        res.status(200).json({ message: '删除成功！' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};