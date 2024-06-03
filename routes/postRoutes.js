const express = require('express');
const postController = require('../controllers/postController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

// router.post('/', authenticate, postController.createPost);
// router.get('/', authenticate, postController.getAllPosts);
router.post('/', postController.createPost);
router.get('/', postController.getAllPosts);
router.get('/:id', authenticate, postController.getPost);
router.put('/update/:id', authenticate, postController.updatePost);
router.delete('/:id', authenticate, postController.deletePost);
router.put('/:id/like', authenticate, postController.likePost);
router.put('/:id/dislike', authenticate, postController.dislikePost);

module.exports = router;