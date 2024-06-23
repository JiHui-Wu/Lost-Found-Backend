const express = require('express');
const { authenticateUser } = require('../middleware/authentication');
const articleController = require('../controllers/articleController');

const router = express.Router();

router.post('/', authenticateUser, articleController.createArticle);
router.get('/', articleController.getAllArticles);
router.get('/:id', articleController.getArticleById);
router.put('/:id', authenticateUser, articleController.updateArticle);
router.delete('/:id', authenticateUser, articleController.deleteArticle);

module.exports = router;
