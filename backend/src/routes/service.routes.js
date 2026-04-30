const express = require('express');
const {
  getServicesByBarber,
  createService,
  updateService,
  deleteService,
} = require('../controllers/service.controller');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// GET /api/services/:barberId — public
router.get('/:barberId', getServicesByBarber);

// Protected routes below
router.use(protect);

// POST /api/services — barber or admin
router.post('/', authorize('barber', 'admin'), createService);

// PUT /api/services/:id — barber or admin
router.put('/:id', authorize('barber', 'admin'), updateService);

// DELETE /api/services/:id — barber or admin
router.delete('/:id', authorize('barber', 'admin'), deleteService);

module.exports = router;
