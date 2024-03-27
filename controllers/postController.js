const Post = require('../models/Post');
const { sendResponse, sendError } = require('../utils');

const createPost = async (req, res) => {
    console.log('Creating new post...');
    try {
        const { title, body, images, author } = req.body;
        const post = new Post({
            title, body, images, author
        })
        await post.save();
        console.log('Post creted successfully');
        sendResponse(res, 201, post);
    } catch (err) {
        console.error('Error creating post:', err.message);
        sendError(res, 400, err.message)
    }
}

module.exports = {
    createPost
}