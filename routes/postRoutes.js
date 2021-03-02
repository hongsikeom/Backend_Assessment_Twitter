const express = require('express');
const userController = require('../controllers/userController')
const postController = require('../controllers/postController');


const router = express.Router();

// Check if user is logged in
// Otherwise cannot create, read, update, delete posts
router.use(userController.isLoggedIn);

// Get all the posts and Create a new post
router.route('/')
    .get(postController.getPosts)
    .post(postController.createPost);

// Get a post from post id (slug)
router.route('/:post')
    .get(postController.getPost)
    .post(postController.reactPost)
    .delete(postController.deletePost)
    .patch(postController.updatePost);

module.exports = router;