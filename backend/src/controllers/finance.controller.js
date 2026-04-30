const Joi = require('joi');
const Booking = require('../models/Booking');
const Expense = require('../models/Expense');
const Barber = require('../models/Barber');
const Service = require('../models/Service');
const User = require('../models/User');

const expenseFields = {
  description: Joi.string().min(2).max(200).required(),
  amount: Joi.number().min(0).required(),
  date: Joi.date().iso(),
};

const createExpenseSchema = Joi.object({
  ...expenseFields,
  barberId: Joi.string(),
});

const updateExpenseSchema = Joi.object(expenseFields);

const getFinanceStats = async (req, res) => {
  try {
    let barberId = null;

    if (req.user.role === 'barber') {
      const barber = await Barber.findOne({ userId: req.user._id });
      if (!barber) {
        return res.status(404).json({ success: false, message: 'Barber profile not found' });
      }
      barberId = barber._id;
    }

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const bookingFilter = barberId
      ? { barberId, status: 'completed' }
      : { status: 'completed' };

    const todayFilter = { ...bookingFilter, startTime: { $gte: startOfToday } };
    const weekFilter = { ...bookingFilter, startTime: { $gte: startOfWeek } };

    const todayBookingsAll = await Booking.find({
      ...(barberId ? { barberId } : {}),
      startTime: { $gte: startOfToday },
    });

    const completedBookings = await Booking.find(bookingFilter)
      .populate('serviceId', 'price name');

    const todayCompletedBookings = await Booking.find(todayFilter)
      .populate('serviceId', 'price name');

    const weeklyCompletedBookings = await Booking.find(weekFilter)
      .populate('serviceId', 'price name');

    const todayRevenue = todayCompletedBookings.reduce((sum, b) => {
      return sum + (b.serviceId ? b.serviceId.price : 0);
    }, 0);

    const weeklyRevenue = weeklyCompletedBookings.reduce((sum, b) => {
      return sum + (b.serviceId ? b.serviceId.price : 0);
    }, 0);

    const totalClients = await User.countDocuments({ role: 'client' });

    const expenseFilter = barberId ? { barberId } : {};
    const expenses = await Expense.find(expenseFilter).sort({ date: -1 });

    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

    const totalRevenue = completedBookings.reduce((sum, b) => {
      return sum + (b.serviceId ? b.serviceId.price : 0);
    }, 0);

    const netProfit = totalRevenue - totalExpenses;

    return res.status(200).json({
      success: true,
      data: {
        todayRevenue,
        weeklyRevenue,
        totalRevenue,
        totalClients,
        todayBookings: todayBookingsAll.length,
        completedBookings: completedBookings.length,
        expenses,
        totalExpenses,
        netProfit,
      },
    });
  } catch (error) {
    console.error('GetFinanceStats error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const createExpense = async (req, res) => {
  try {
    const { error, value } = createExpenseSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    let barberId;
    if (req.user.role === 'barber') {
      const barber = await Barber.findOne({ userId: req.user._id });
      if (!barber) {
        return res.status(404).json({ success: false, message: 'Barber profile not found' });
      }
      barberId = barber._id;
    } else if (value.barberId) {
      const barber = await Barber.findById(value.barberId);
      if (!barber) {
        return res.status(404).json({ success: false, message: 'Barber not found' });
      }
      barberId = value.barberId;
    } else {
      return res.status(400).json({ success: false, message: 'barberId is required for admin' });
    }

    const { barberId: _ignored, ...expenseData } = value;
    const expense = await Expense.create({ ...expenseData, barberId });
    return res.status(201).json({ success: true, data: expense });
  } catch (error) {
    console.error('CreateExpense error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateExpense = async (req, res) => {
  try {
    const { error, value } = updateExpenseSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    if (req.user.role === 'barber') {
      const barber = await Barber.findOne({ userId: req.user._id });
      if (!barber || expense.barberId.toString() !== barber._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }
    }

    const updated = await Expense.findByIdAndUpdate(req.params.id, value, { new: true });
    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error('UpdateExpense error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    if (req.user.role === 'barber') {
      const barber = await Barber.findOne({ userId: req.user._id });
      if (!barber || expense.barberId.toString() !== barber._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }
    }

    await Expense.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.error('DeleteExpense error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getFinanceStats, createExpense, updateExpense, deleteExpense };
