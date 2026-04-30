const Joi = require('joi');
const User = require('../models/User');
const Barber = require('../models/Barber');
const Booking = require('../models/Booking');
const Service = require('../models/Service');

const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  role: Joi.string().valid('admin', 'barber', 'client'),
  isBlocked: Joi.boolean(),
  styleCoins: Joi.number().min(0),
});

const getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBarbers = await Barber.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayBookings = await Booking.countDocuments({
      startTime: { $gte: startOfToday },
    });

    const recentBookings = await Booking.find()
      .populate('clientId', 'name email')
      .populate({ path: 'barberId', populate: { path: 'userId', select: 'name' } })
      .populate('serviceId', 'name price')
      .sort({ createdAt: -1 })
      .limit(10);

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalBarbers,
        totalBookings,
        todayBookings,
        bookingStats: {
          pending: pendingBookings,
          confirmed: confirmedBookings,
          completed: completedBookings,
          cancelled: cancelledBookings,
        },
        recentBookings,
      },
    });
  } catch (error) {
    console.error('GetDashboard error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    const filter = role ? { role } : {};
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    return res.status(200).json({
      success: true,
      data: users,
      pagination: { total, page: parseInt(page), limit: parseInt(limit) },
    });
  } catch (error) {
    console.error('GetAllUsers error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { error, value } = updateUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const user = await User.findByIdAndUpdate(req.params.id, value, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error('UpdateUser error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const verifyBarber = async (req, res) => {
  try {
    const barber = await Barber.findByIdAndUpdate(
      req.params.barberId,
      { isVerified: true },
      { new: true }
    ).populate('userId', 'name email');

    if (!barber) {
      return res.status(404).json({ success: false, message: 'Barber not found' });
    }

    return res.status(200).json({ success: true, data: barber });
  } catch (error) {
    console.error('VerifyBarber error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getDashboard, getAllUsers, updateUser, verifyBarber };
