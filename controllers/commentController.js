const Comment = require('../models/Comment');
const Article = require('../models/Article');

exports.createComment = async (req, res) => {
    const { articleId, content } = req.body;
    const author = req.user.user_id;  // 获取当前用户的ID

    try {
        const article = await Article.findById(articleId);
        if (!article) {
            return res.status(404).json({ message: '文章未找到' });
        }

        const newComment = new Comment({ article: articleId, author, content });
        await newComment.save();
        res.status(201).json({ message: '评论创建成功', comment: newComment });
    } catch (error) {
        res.status(500).json({ message: '创建评论时发生错误', error });
    }
};

exports.deleteComment = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.user_id;  // 获取当前用户的ID
    const isAdmin = req.user.isAdmin; // 获取当前用户是否为管理员

    try {
        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({ message: '评论未找到' });
        }

        // 检查当前用户是否是评论作者或管理员
        if (comment.author.toString() !== userId && !isAdmin) {
            return res.status(403).json({ message: '你没有权限删除这条评论' });
        }

        await Comment.findByIdAndDelete(id);
        res.status(200).json({ message: '评论删除成功' });
    } catch (error) {
        res.status(500).json({ message: '删除评论时发生错误', error });
    }
};

// 获取指定文章的所有评论
exports.getCommentsByArticleId = async (req, res) => {
    const { articleId } = req.params;

    try {
        const comments = await Comment.find({ article: articleId }).populate('author', 'username');
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: '获取评论时发生错误', error });
    }
};
