const express = require('express');
const { chat } = require('../controllers/chat.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

// POST /api/chat — requires authentication
router.post('/', protect, chat);

module.exports = router;
