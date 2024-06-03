const Comment = require('../models/Comment');
const { sendResponse, sendError } = require('../utils');

const postComment = async (req, res) => {
    try {
        const { content, parentComment } = req.body;
        const comment = new Comment({
            content, 
            parentComment,
            author: req.user.userId,
            post: req.params.id
        });
        console.log(comment);
        console.log(req.user);
        await comment.save();
        console.log('Comment created');
        sendResponse(res, 201, comment);
    }  catch(err) {
        console.error('Error creating comment on post', err.message)
        sendError(res, 400, err.message);
    }
};

const updateComment = async (req, res) => {
    try {
        const { content } = req.body;
        const comment = await Comment.findByIdAndUpdate(
            req.params.id,
            { content },
            { new: true }
        )
        if (!comment) {
            console.error('Comment not found')
            return sendError(res, 404, 'Comment not found');
        }
        sendResponse(res, 200, comment);
    } catch (err) {
        console.error('Error updating comment', err.message);
        sendError(res, 400, err.message)
    }
};

const deleteComment = async (req, res) => {
    try {
        const comment = Comment.findById(req.params.id);
        if (!comment) {
            console.error('Comment not found');
            return sendError(res, 404, 'Comment not found');
        }
        await comment.deleteOne();
        console.log('Comment deleted successfully');
        sendResponse(res, 200, 'Comment deleted successfully');
    } catch (err) {
        console.error('Error deleting comment', err.message);
        sendError(res, 400, err.message);
    }
};

const likeComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req,params.id);
        if (!comment) {
            console.error('Comment not found');
            sendError(res, 404, 'Comment not found')
        }
        
        if (comment.likes.includes(userId)){
            comment.likes.pull(userId);
        } else {
            comment.likes.addToSet(userId);
            comment.dislikes.pull(userId);
        }

        await comment.save();
        sendResponse(res, 200, comment);
    } catch ( err) {
        console.error('Error toggling like on comment', err.message);
        sendError(res, 400, err.message)
    }
};

const dislikeComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req,params.id);
        if (!comment) {
            console.error('Comment not found');
            sendError(res, 404, 'Comment not found')
        }

        if (comment.dislikes.includes(userId)){
            comment.dislikes.pull(userId);
        } else {
            comment.dislikes.addToSet(userId);
            comment.likes.pull(userId);
        }

        await comment.save();
        sendResponse(res, 200, comment);
    } catch ( err) {
        console.error('Error toggling like on comment', err.message);
        sendError(res, 400, err.message)
    }
};

module.exports = { 
    postComment,
    updateComment,
    deleteComment,
    likeComment,
    dislikeComment
}