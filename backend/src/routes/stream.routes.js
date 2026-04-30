const express = require('express');
const { streamQueue } = require('../controllers/stream.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/stream/queue — SSE endpoint, requires authentication
router.get('/queue', protect, streamQueue);

module.exports = router;
