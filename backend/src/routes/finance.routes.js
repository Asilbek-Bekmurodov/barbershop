const express = require('express');
const {
  getFinanceStats,
  createExpense,
  updateExpense,
  deleteExpense,
} = require('../controllers/finance.controller');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication and barber/admin role
router.use(protect);
router.use(authorize('barber', 'admin'));

// GET /api/finance/stats
router.get('/stats', getFinanceStats);

// POST /api/finance/expense
router.post('/expense', createExpense);

// PUT /api/finance/expense/:id
router.put('/expense/:id', updateExpense);

// DELETE /api/finance/expense/:id
router.delete('/expense/:id', deleteExpense);

module.exports = router;
