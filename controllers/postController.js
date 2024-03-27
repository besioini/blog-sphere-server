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

const getPost = async (req, res) => {
    console.log(`Fetching post with ID: ${req.params.id}`);
    try {
        const post = await Post.findById(req.params.id).populate('author');
        if (!post) {
            console.log('Post not found');
            return sendError(res, 404, 'Post not found');
        }
        console.log('Post found:', post);
        sendResponse(res, 200, post);

    } catch (err) {
        console.log('Error fetching post', err.message);
        sendError(res, 500, err.message);
    }

}

const getAllPosts = async (req, res) => {
    console.log('Fetching all posts');
    try {
        const posts = await Post.find().populate('author');
        console.log(`Found ${posts.length} posts`);
        sendResponse(res, 200, posts);
    } catch (err) {
        console.log('Error fetching posts:', err.message);
        sendError(res, 500, err.message)
    }
}

const updatePost = async (req, res) => {
    console.log(`Updating post with ID: ${req.params.id}`);
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            console.log('Post not found');
            return sendError(res, 404, 'Post not found');
        }

        if (post.author.toString() !== req.user.userId.toString()) {
            console.log('Unauthorized to update post');
            return sendError(res, 401, 'Unauthorized to update post');
        }

        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        console.log('Post updated successfully');
        sendResponse(res, 200, updatedPost);
    } catch (err) {
        console.log(`Error updating post: ${err.message}`);
        sendError(res, 400, err.message);
    }
};

const deletePost = async (req, res) => {
    console.log(`Deleting post withID: ${req.params.id}`)
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            console.log('Post not found');
            return sendError(res, 404, 'Post not found');
        }

        if (post.author.toString() !== req.user.userId.toString()) {
            console.log('Unauthorized to update post');
            return sendError(res, 401, 'Unauthorized to update post');
        }  
        
        await post.deleteOne();
        console.log('Post deleted successfully');
        sendResponse(res, 200, 'Post deleted successfully');
    } catch(err) {
        console.log('Error deleting post', err.message);
        sendError(res, 500, err.message);
    }
}

module.exports = {
    createPost,
    updatePost,
    getPost,
    getAllPosts,
    deletePost
}