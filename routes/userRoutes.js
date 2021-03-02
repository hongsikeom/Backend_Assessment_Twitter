const express = require('express');
const userController = require('../controllers/userController');


const router = express.Router();

// Login routes
router.route('/').get(userController.getMain);
router.route('/signup').post(userController.signUp);
router.route('/login').post(userController.login);
router.route('/logout').get(userController.logout);

module.exports = router;