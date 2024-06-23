const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const upload = require('../utils/upload');

router.post('/check-file', uploadController.checkFileExists);
router.post('/upload-chunk', upload.single('file'), uploadController.uploadChunk);
router.get('/files', uploadController.getFiles);
router.delete('/files/:fileName', uploadController.deleteFile);
router.get('/download/:fileName', uploadController.downloadFile);

module.exports = router;
