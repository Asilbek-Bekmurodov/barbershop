const express = require('express');
const { ping } = require('../controllers/health.controller');

const router = express.Router();

// GET /api/health
router.get('/', ping);

module.exports = router;
