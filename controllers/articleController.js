const Article = require('../models/Article');
const Comment = require('../models/Comment');
const upload = require('../utils/upload'); // 引入上传模块


// 创建帖子
exports.createArticle = [
    upload.array('images', 5), // 允许上传最多5张图片
    async (req, res) => {
        try {
            const { title, content } = req.body;
            const author = req.user.user_id;
            // 确保每个文件信息封装成一个对象
            const images = req.files ? req.files.map(file => ({ url: `/uploads/${file.filename}` })) : [];
            const newArticle = new Article({ title, content, images, author });
            await newArticle.save();
            res.status(201).json({ message: '帖子创建成功', article: newArticle });
        } catch (error) {
            console.log(error); // 打印错误详细信息有助于调试
            res.status(500).json({ message: '帖子创建失败', error });
        }
    }
];
// 更新帖子
exports.updateArticle = async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.user.user_id;  // 获取当前用户的ID

    try {
        // 查找帖子，确保只有作者本人可以更新
        const article = await Article.findById(id);
        if (!article) {
            return res.status(404).json({ message: '帖子未找到' });
        }

        // 检查当前用户是否是发帖作者
        if (article.author.toString() !== userId) {
            return res.status(403).json({ message: '你没有权限修改这篇帖子' });
        }

        // 更新文章
        article.title = title || article.title;
        article.content = content || article.content;
        await article.save();

        res.status(200).json({ message: '帖子更新成功', article });
    } catch (error) {
        res.status(500).json({ message: '更新时发生错误', error });
    }
};

// 获取所有帖子
exports.getAllArticles = async (req, res) => {
    try {
        const articles = await Article.find().populate('author', 'username');
        res.status(200).json(articles);
    } catch (error) {
        res.status(500).json({ message: '获取帖子时发生错误', error });
    }
};

// 获取单个帖子及其评论
exports.getArticleById = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id).populate('author', 'username');
        if (!article) {
            return res.status(404).json({ message: '帖子未找到' });
        }
        const comments = await Comment.find({ article: req.params.id }).populate('author', 'username');
        res.status(200).json({ article, comments });
    } catch (error) {
        res.status(500).json({ message: '获取帖子时发生错误', error });
    }
};

// 删除帖子
exports.deleteArticle = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.user_id;
    const isAdmin = req.user.isAdmin;

    try {
        const article = await Article.findById(id);
        if (!article) {
            return res.status(404).json({ message: '帖子未找到' });
        }

        if (article.author.toString() !== userId && !isAdmin) {
            return res.status(403).json({ message: '你没有权限删除' });
        }

        await Article.findByIdAndDelete(id);
        await Comment.deleteMany({ article: id });
        res.status(200).json({ message: '帖子删除成功' });
    } catch (error) {
        res.status(500).json({ message: '删除帖子时发生错误', error });
    }
};
