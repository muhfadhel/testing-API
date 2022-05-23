var express = require('express');
var router = express.Router();
var authController = require('../controllers/userController');

/**
 * Register
 */
router.post('/register', authController.registrasi);

/**
 * Login
 */
router.post('/login', authController.login);

module.exports = router;