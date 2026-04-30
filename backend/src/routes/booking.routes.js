const express = require('express');
const {
  getBookings,
  getMyBookings,
  createBooking,
  updateBookingStatus,
  deleteBooking,
} = require('../controllers/booking.controller');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// GET /api/bookings — admin only (all bookings)
router.get('/', authorize('admin'), getBookings);

// GET /api/bookings/my — client/barber sees own bookings
router.get('/my', getMyBookings);

// POST /api/bookings — client creates booking
router.post('/', authorize('client', 'admin'), createBooking);

// PATCH /api/bookings/:id — update status
router.patch('/:id', updateBookingStatus);

// DELETE /api/bookings/:id
router.delete('/:id', deleteBooking);

module.exports = router;
