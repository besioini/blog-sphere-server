const express = require('express');
const commentController = require('../controllers/commentController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.post('/posts/:id', authenticate, commentController.postComment);
router.put('/:id', authenticate, commentController.updateComment);
router.delete('/:id', authenticate, commentController.deleteComment);
router.put('/:id/like', authenticate, commentController.likeComment);
router.put('/:id/dislike', authenticate, commentController.dislikeComment)

module.exports = router;