// routes/permissions.js

const express = require('express');
const router = express.Router();
const permissionsController = require('../controllers/permissionsController');
const { authenticateAdmin } = require('../middleware/authentication');

// 获取所有用户
router.get('/allusers', authenticateAdmin, permissionsController.getAllUsers);

// 删除用户
router.delete('/deleteuser/:email', authenticateAdmin, permissionsController.deleteUser);

module.exports = router;
