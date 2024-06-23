const express = require('express');
const router = express.Router();
const itemsController = require('../controllers/itemsController');
const { authenticateUser, authenticateAdmin } = require('../middleware/authentication');

// 获取所有失物招领信息（公开）
router.get('/lostItems', itemsController.getAllLostItems);

// 获取所有寻物启事信息（公开）
router.get('/foundItems', itemsController.getAllFoundItems);

// 发布失物信息（需要登录）
router.post('/publishLostItem', authenticateUser, itemsController.publishLostItem);

// 发布找到信息（需要登录）
router.post('/publishFoundItem', authenticateUser, itemsController.publishFoundItem);

// 获取当前用户发布的失物信息（需要登录）
router.get('/myLostItems', authenticateUser, itemsController.getMyLostItems);

// 获取当前用户发布的物品信息（需要登录）
router.get('/myFoundItems', authenticateUser, itemsController.getMyFoundItems);

router.delete('/deleteItem/:itemType/:itemId', itemsController.deleteItem);

module.exports = router;
