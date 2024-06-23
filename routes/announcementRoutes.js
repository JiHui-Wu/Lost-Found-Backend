const express = require('express');
const { createAnnouncement, getAllAnnouncements, deleteAnnouncement, updateAnnouncement } = require('../controllers/announcementController');
const { authenticateAdmin } = require('../middleware/authentication');

const router = express.Router();

router.post('/', authenticateAdmin, createAnnouncement);
router.get('/', getAllAnnouncements);
router.delete('/:id', authenticateAdmin, deleteAnnouncement);
router.put('/:id', authenticateAdmin, updateAnnouncement);

module.exports = router;