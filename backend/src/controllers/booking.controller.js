const Joi = require('joi');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Barber = require('../models/Barber');
const User = require('../models/User');

const ACTIVE_BOOKING_STATUSES = ['pending', 'confirmed', 'in_progress'];

const createBookingSchema = Joi.object({
  barberId: Joi.string().required(),
  serviceId: Joi.string().required(),
  startTime: Joi.date().iso().required(),
});

const updateStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'confirmed', 'in_progress', 'completed', 'cancelled').required(),
});

const getObjectId = (value) => {
  if (!value) return null;
  if (value._id) return value._id.toString();
  return value.toString();
};

const parseTimeToMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const isInsideWorkingHours = (barber, startDate, endDate) => {
  if (startDate.toDateString() !== endDate.toDateString()) return false;

  const workingStart = parseTimeToMinutes(barber.workingHours.start);
  const workingEnd = parseTimeToMinutes(barber.workingHours.end);
  const bookingStart = startDate.getHours() * 60 + startDate.getMinutes();
  const bookingEnd = endDate.getHours() * 60 + endDate.getMinutes();

  return bookingStart >= workingStart && bookingEnd <= workingEnd;
};

const emitBookingEvent = (req, eventName, booking) => {
  const io = req.app.get('io');
  if (!io || !booking) return;

  const barberId = getObjectId(booking.barberId);
  const clientId = getObjectId(booking.clientId);

  if (barberId) io.to(`barber:${barberId}`).emit(eventName, booking);
  if (clientId) io.to(`client:${clientId}`).emit(eventName, booking);
  io.to('admin').emit(eventName, booking);
};

const getMyBarber = async (userId) => Barber.findOne({ userId });

const canBarberTransition = (fromStatus, toStatus) => {
  const transitions = {
    pending: ['confirmed', 'in_progress', 'cancelled'],
    confirmed: ['in_progress', 'completed', 'cancelled'],
    in_progress: ['completed', 'cancelled'],
    completed: [],
    cancelled: [],
  };

  return transitions[fromStatus]?.includes(toStatus) || false;
};

const assertCanUpdateStatus = async (req, booking, nextStatus) => {
  if (req.user.role === 'admin') return { allowed: true };

  if (req.user.role === 'client') {
    const ownsBooking = booking.clientId.toString() === req.user._id.toString();
    if (!ownsBooking) return { allowed: false, status: 403, message: 'Not authorized' };

    const canCancel = nextStatus === 'cancelled' && ['pending', 'confirmed'].includes(booking.status);
    if (!canCancel) {
      return {
        allowed: false,
        status: 400,
        message: 'Clients can only cancel their own pending or confirmed bookings',
      };
    }

    return { allowed: true };
  }

  if (req.user.role === 'barber') {
    const barber = await getMyBarber(req.user._id);
    const ownsBooking = barber && booking.barberId.toString() === barber._id.toString();
    if (!ownsBooking) return { allowed: false, status: 403, message: 'Not authorized' };

    if (!canBarberTransition(booking.status, nextStatus)) {
      return {
        allowed: false,
        status: 400,
        message: `Cannot change booking status from ${booking.status} to ${nextStatus}`,
      };
    }

    return { allowed: true };
  }

  return { allowed: false, status: 403, message: 'Not authorized' };
};

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

    const barber = await Barber.findById(barberId);
    if (!barber) {
      return res.status(404).json({ success: false, message: 'Barber not found' });
    }

    if (!barber.isVerified) {
      return res.status(400).json({ success: false, message: 'Barber is not verified for bookings' });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    if (service.barberId.toString() !== barberId) {
      return res.status(400).json({ success: false, message: 'Service does not belong to this barber' });
    }

    const startDate = new Date(startTime);
    const endDate = new Date(startDate.getTime() + service.duration * 60 * 1000);

    if (startDate <= new Date()) {
      return res.status(400).json({ success: false, message: 'Booking time must be in the future' });
    }

    if (!isInsideWorkingHours(barber, startDate, endDate)) {
      return res.status(400).json({ success: false, message: 'Booking time is outside barber working hours' });
    }

    // Double booking check: prevent overlapping appointments
    const overlap = await Booking.findOne({
      barberId,
      status: { $in: ACTIVE_BOOKING_STATUSES },
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

    let booking;
    try {
      booking = await Booking.create({
        clientId: req.user._id,
        barberId,
        serviceId,
        startTime: startDate,
        endTime: endDate,
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message: 'This time slot is already booked. Please choose another time.',
        });
      }
      throw error;
    }

    const populatedBooking = await Booking.findById(booking._id)
      .populate('clientId', 'name email avatar')
      .populate({ path: 'barberId', populate: { path: 'userId', select: 'name email avatar' } })
      .populate('serviceId');

    emitBookingEvent(req, 'booking:new', populatedBooking);

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

    const auth = await assertCanUpdateStatus(req, booking, value.status);
    if (!auth.allowed) {
      return res.status(auth.status).json({ success: false, message: auth.message });
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

    emitBookingEvent(req, 'booking:update', updatedBooking);

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

    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only admins can delete bookings' });
    }

    await Booking.findByIdAndDelete(req.params.id);

    emitBookingEvent(req, 'booking:update', {
      _id: req.params.id,
      clientId: booking.clientId,
      barberId: booking.barberId,
      status: 'deleted',
    });

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
