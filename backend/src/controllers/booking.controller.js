const Joi = require('joi');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Barber = require('../models/Barber');
const User = require('../models/User');

const createBookingSchema = Joi.object({
  barberId: Joi.string().required(),
  serviceId: Joi.string().required(),
  startTime: Joi.date().iso().required(),
});

const updateStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'confirmed', 'completed', 'cancelled').required(),
});

const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('clientId', 'name email avatar')
      .populate({ path: 'barberId', populate: { path: 'userId', select: 'name email avatar' } })
      .populate('serviceId')
      .sort({ startTime: -1 });

    return res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    console.error('GetBookings error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getMyBookings = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'client') {
      query.clientId = req.user._id;
    } else if (req.user.role === 'barber') {
      const barber = await Barber.findOne({ userId: req.user._id });
      if (!barber) {
        return res.status(404).json({ success: false, message: 'Barber profile not found' });
      }
      query.barberId = barber._id;
    } else {
      // admin sees all
    }

    const bookings = await Booking.find(query)
      .populate('clientId', 'name email avatar')
      .populate({ path: 'barberId', populate: { path: 'userId', select: 'name email avatar' } })
      .populate('serviceId')
      .sort({ startTime: -1 });

    return res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    console.error('GetMyBookings error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const createBooking = async (req, res) => {
  try {
    const { error, value } = createBookingSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const { barberId, serviceId, startTime } = value;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    if (service.barberId.toString() !== barberId) {
      return res.status(400).json({ success: false, message: 'Service does not belong to this barber' });
    }

    const startDate = new Date(startTime);
    const endDate = new Date(startDate.getTime() + service.duration * 60 * 1000);

    // Double booking check: prevent overlapping appointments
    const overlap = await Booking.findOne({
      barberId,
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        { startTime: { $lt: endDate }, endTime: { $gt: startDate } },
      ],
    });

    if (overlap) {
      return res.status(409).json({
        success: false,
        message: 'This time slot is already booked. Please choose another time.',
      });
    }

    const booking = await Booking.create({
      clientId: req.user._id,
      barberId,
      serviceId,
      startTime: startDate,
      endTime: endDate,
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('clientId', 'name email avatar')
      .populate({ path: 'barberId', populate: { path: 'userId', select: 'name email avatar' } })
      .populate('serviceId');

    // Emit Socket.io event
    const io = req.app.get('io');
    if (io) {
      io.emit('booking:new', populatedBooking);
    }

    return res.status(201).json({ success: true, data: populatedBooking });
  } catch (error) {
    console.error('CreateBooking error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { error, value } = updateStatusSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Authorization check
    if (req.user.role === 'client' && booking.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (req.user.role === 'barber') {
      const barber = await Barber.findOne({ userId: req.user._id });
      if (!barber || booking.barberId.toString() !== barber._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }
    }

    const previousStatus = booking.status;
    booking.status = value.status;

    // Award StyleCoins when booking is completed
    if (value.status === 'completed' && previousStatus !== 'completed') {
      await User.findByIdAndUpdate(booking.clientId, {
        $inc: { styleCoins: booking.styleCoinEarned },
      });
    }

    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate('clientId', 'name email avatar')
      .populate({ path: 'barberId', populate: { path: 'userId', select: 'name email avatar' } })
      .populate('serviceId');

    // Emit Socket.io event
    const io = req.app.get('io');
    if (io) {
      io.emit('booking:update', updatedBooking);
    }

    return res.status(200).json({ success: true, data: updatedBooking });
  } catch (error) {
    console.error('UpdateBookingStatus error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (req.user.role === 'client' && booking.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await Booking.findByIdAndDelete(req.params.id);

    const io = req.app.get('io');
    if (io) {
      io.emit('booking:update', { _id: req.params.id, status: 'deleted' });
    }

    return res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.error('DeleteBooking error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getBookings,
  getMyBookings,
  createBooking,
  updateBookingStatus,
  deleteBooking,
};
