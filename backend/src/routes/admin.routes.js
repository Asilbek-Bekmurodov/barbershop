const express = require('express');
const {
  getDashboard,
  getAllUsers,
  updateUser,
  verifyBarber,
} = require('../controllers/admin.controller');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// GET /api/admin/dashboard
router.get('/dashboard', getDashboard);

// GET /api/admin/users
router.get('/users', getAllUsers);

// PUT /api/admin/users/:id
router.put('/users/:id', updateUser);

// POST /api/admin/verify/:barberId
router.post('/verify/:barberId', verifyBarber);

module.exports = router;
