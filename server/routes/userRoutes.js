const express = require('express');
const { register, login } = require('../controllers/userController');

const router = express.Router();

router.post('/', register);
router.get('/', login);

module.exports = router;
