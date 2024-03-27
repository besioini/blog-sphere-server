const express = require('express');
const postController = require('../controllers/postController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.post('/', authenticate, postController.createPost);

module.exports = router;