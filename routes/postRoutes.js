const express = require('express');
const postController = require('../controllers/postController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.post('/', authenticate, postController.createPost);
router.put('/update/:id', authenticate, postController.updatePost);
router.get('/:id', authenticate, postController.getPost);
router.get('/', authenticate, postController.getAllPosts);
router.delete('/:id', authenticate, postController.deletePost);

module.exports = router;