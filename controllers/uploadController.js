const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const fse = require('fs-extra');

// 检查文件是否已存在
exports.checkFileExists = (req, res) => {
    const { hash, totalChunks } = req.body;  // 文件的唯一标识符和总块数
    const chunksDir = path.resolve(__dirname, '..', 'uploads', hash);

    if (fs.existsSync(chunksDir)) {
        // 读取目录中的所有文件（块）
        fs.readdir(chunksDir, (err, files) => {
            if (err) {
                return res.status(500).json({ exists: false });
            }
            // 如果目录中的文件数量等于总块数，则认为文件完整
            res.status(200).json({ exists: files.length === totalChunks });
        });
    } else {
        res.status(200).json({ exists: false });
    }
};

exports.uploadChunk = (req, res) => {
    const { chunkNumber, totalChunks, fileName, hash } = req.body;
    const chunkDir = path.resolve(__dirname, '..', 'uploads', hash);

    if (!fs.existsSync(chunkDir)) {
        fs.mkdirSync(chunkDir, { recursive: true });
    }

    const chunkPath = path.join(chunkDir, `${chunkNumber}`);
    const tempPath = req.file.path;

    if (fs.existsSync(chunkPath)) {
        fs.unlinkSync(chunkPath); // 确保旧文件块被删除
    }

    fse.move(tempPath, chunkPath, (err) => {
        if (err) {
            console.error('Error moving chunk:', err);
            return res.status(500).json({ message: 'Error moving chunk' });
        }

        if (parseInt(chunkNumber) === parseInt(totalChunks)) {
            mergeChunks(chunkDir, path.resolve(__dirname, '..', 'uploads', fileName))
                .then(() => res.status(200).json({ message: 'Chunk uploaded and merged successfully' }))
                .catch((err) => {
                    console.error('Error merging chunks:', err);
                    res.status(500).json({ message: 'Error merging chunks' });
                });
        } else {
            res.status(200).json({ message: 'Chunk uploaded successfully' });
        }
    });
};


// 合并文件块
const mergeChunks = (chunkDir, filePath) => {
    return new Promise((resolve, reject) => {
        const writeStream = fs.createWriteStream(filePath);
        const chunks = fs.readdirSync(chunkDir).sort((a, b) => parseInt(a) - parseInt(b));

        chunks.forEach((chunk, index) => {
            const chunkPath = path.join(chunkDir, chunk);
            const data = fs.readFileSync(chunkPath);
            writeStream.write(data);
            fs.unlinkSync(chunkPath);  // 删除每个块文件以节省空间
        });

        writeStream.end();
        writeStream.on('finish', () => {
            fs.rm(chunkDir, { recursive: true, force: true }, (err) => {
                if (err) {
                    console.error('Error removing directory:', err);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        writeStream.on('error', (err) => {
            reject(err);
        });
    });
};

// 获取文件列表
exports.getFiles = (req, res) => {
    try {
        const directoryPath = path.join(__dirname, '..', 'uploads');
        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                console.error('Error reading files:', err);
                return res.status(500).send({
                    message: 'Unable to scan files!'
                });
            }
            const fileList = files.map(file => {
                const filePath = path.join(directoryPath, file);
                const stats = fs.statSync(filePath);
                return {
                    name: file,
                    size: stats.size
                };
            });
            res.status(200).send(fileList);
        });
    } catch (err) {
        console.error('Unexpected error in getFiles:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// 删除文件
exports.deleteFile = (req, res) => {
    try {
        const fileName = req.params.fileName;
        const filePath = path.join(__dirname, '..', 'uploads', fileName);

        if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                    return res.status(500).send({
                        message: 'Could not delete file'
                    });
                }
                res.status(200).send({ message: 'File deleted successfully' });
            });
        } else {
            return res.status(404).send({ message: 'File not found' });
        }
    } catch (err) {
        console.error('Unexpected error in deleteFile:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// 下载文件
exports.downloadFile = (req, res) => {
    try {
        const fileName = req.params.fileName;
        const filePath = path.resolve(__dirname, '..', 'uploads', fileName);

        fs.stat(filePath, (err, stats) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    return res.status(404).send('File not found');
                }
                console.error('Error stating file:', err);
                return res.status(500).send(err);
            }

            const range = req.headers.range;
            if (!range) {
                // 如果请求头中没有 Range，发送整个文件
                res.writeHead(200, {
                    'Content-Type': 'application/octet-stream',
                    'Content-Length': stats.size
                });
                fs.createReadStream(filePath).pipe(res);
            } else {
                // 如果请求头中有 Range，发送部分文件
                const positions = range.replace(/bytes=/, '').split('-');
                const start = parseInt(positions[0], 10);
                const end = positions[1] ? parseInt(positions[1], 10) : stats.size - 1;

                if (start >= stats.size || end >= stats.size) {
                    // 如果 Range 无效，返回 416 错误
                    res.writeHead(416, {
                        'Content-Range': `bytes */${stats.size}`
                    });
                    return res.end();
                }

                res.writeHead(206, {
                    'Content-Range': `bytes ${start}-${end}/${stats.size}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': end - start + 1,
                    'Content-Type': 'application/octet-stream'
                });

                fs.createReadStream(filePath, { start, end }).pipe(res);
            }
        });
    } catch (err) {
        console.error('Unexpected error in downloadFile:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};
