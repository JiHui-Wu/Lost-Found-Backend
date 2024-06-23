const express = require('express');
const { authenticateUser } = require('../middleware/authentication');
const commentController = require('../controllers/commentController');

const router = express.Router();

router.post('/', authenticateUser, commentController.createComment);
router.delete('/:id', authenticateUser, commentController.deleteComment);
router.get('/article/:articleId', commentController.getCommentsByArticleId);
module.exports = router;
