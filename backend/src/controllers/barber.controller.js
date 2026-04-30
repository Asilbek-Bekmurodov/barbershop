const Joi = require('joi');
const Barber = require('../models/Barber');
const User = require('../models/User');

const createBarberSchema = Joi.object({
  userId: Joi.string().required(),
  bio: Joi.string().max(500).allow(''),
  workingHours: Joi.object({
    start: Joi.string().pattern(/^\d{2}:\d{2}$/),
    end: Joi.string().pattern(/^\d{2}:\d{2}$/),
  }),
  portfolio: Joi.array().items(Joi.string().uri()),
});

const updateBarberSchema = Joi.object({
  bio: Joi.string().max(500).allow(''),
  workingHours: Joi.object({
    start: Joi.string().pattern(/^\d{2}:\d{2}$/),
    end: Joi.string().pattern(/^\d{2}:\d{2}$/),
  }),
  portfolio: Joi.array().items(Joi.string().uri()),
});

const getAllBarbers = async (req, res) => {
  try {
    const barbers = await Barber.find().populate('userId', 'name email avatar');
    return res.status(200).json({ success: true, data: barbers });
  } catch (error) {
    console.error('GetAllBarbers error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getBarberById = async (req, res) => {
  try {
    const barber = await Barber.findById(req.params.id).populate('userId', 'name email avatar');
    if (!barber) {
      return res.status(404).json({ success: false, message: 'Barber not found' });
    }
    return res.status(200).json({ success: true, data: barber });
  } catch (error) {
    console.error('GetBarberById error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const createBarber = async (req, res) => {
  try {
    const { error, value } = createBarberSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const userExists = await User.findById(value.userId);
    if (!userExists) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const existingBarber = await Barber.findOne({ userId: value.userId });
    if (existingBarber) {
      return res.status(400).json({ success: false, message: 'Barber profile already exists for this user' });
    }

    const barber = await Barber.create(value);
    await User.findByIdAndUpdate(value.userId, { role: 'barber' });

    return res.status(201).json({ success: true, data: barber });
  } catch (error) {
    console.error('CreateBarber error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateMyBarberProfile = async (req, res) => {
  try {
    const { error, value } = updateBarberSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const barber = await Barber.findOneAndUpdate(
      { userId: req.user._id },
      value,
      { new: true, runValidators: true }
    ).populate('userId', 'name email avatar');

    if (!barber) {
      return res.status(404).json({ success: false, message: 'Barber profile not found' });
    }

    return res.status(200).json({ success: true, data: barber });
  } catch (error) {
    console.error('UpdateMyBarberProfile error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const deleteBarber = async (req, res) => {
  try {
    const barber = await Barber.findByIdAndDelete(req.params.id);
    if (!barber) {
      return res.status(404).json({ success: false, message: 'Barber not found' });
    }
    return res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.error('DeleteBarber error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getAllBarbers,
  getBarberById,
  createBarber,
  updateMyBarberProfile,
  deleteBarber,
};
