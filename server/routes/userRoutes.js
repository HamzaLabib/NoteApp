const express = require('express');
const { register, login, welcome } = require('../controllers/userController');
const { isAuthenticated } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/welcome', isAuthenticated, welcome);

module.exports = router;
