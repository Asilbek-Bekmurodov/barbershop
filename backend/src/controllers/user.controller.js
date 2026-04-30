const Joi = require('joi');
const User = require('../models/User');

const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  avatar: Joi.string().uri().allow(''),
});

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error('GetMe error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { error, value } = updateProfileSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const user = await User.findByIdAndUpdate(req.user._id, value, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error('UpdateProfile error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const deleteMe = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    return res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.error('DeleteMe error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getMe, updateProfile, deleteMe };
