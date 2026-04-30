const express = require('express');
const { getMe, updateProfile, deleteMe } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// GET /api/users/me
router.get('/me', getMe);

// PUT /api/users/profile
router.put('/profile', updateProfile);

// DELETE /api/users/me
router.delete('/me', deleteMe);

module.exports = router;
