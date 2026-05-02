const express = require('express');
const {
  getAllBarbers,
  getBarberById,
  createBarber,
  updateMyBarberProfile,
  deleteBarber,
} = require('../controllers/barber.controller');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// GET /api/barbers — public
router.get('/', getAllBarbers);

// GET /api/barbers/:id — public
router.get('/:id', getBarberById);

// Protected routes below
router.use(protect);

// POST /api/barbers — client (o'zi uchun) yoki admin (boshqa user uchun)
router.post('/', authorize('client', 'admin'), createBarber);

// PUT /api/barbers/me — barber or admin
router.put('/me', authorize('barber', 'admin'), updateMyBarberProfile);

// DELETE /api/barbers/:id — admin only
router.delete('/:id', authorize('admin'), deleteBarber);

module.exports = router;
