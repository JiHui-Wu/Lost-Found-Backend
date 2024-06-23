const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authentication');
const messageController = require('../controllers/messageController');

router.post('/send', authenticateUser, messageController.sendMessage);
router.get('/received', authenticateUser, messageController.getReceivedMessages);
router.delete('/:messageId', authenticateUser, messageController.deleteMessage);
module.exports = router;