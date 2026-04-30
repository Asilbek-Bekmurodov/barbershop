const Joi = require('joi');
const Service = require('../models/Service');
const Barber = require('../models/Barber');

const createServiceSchema = Joi.object({
  barberId: Joi.string().required(),
  name: Joi.string().min(2).max(100).required(),
  price: Joi.number().min(0).required(),
  duration: Joi.number().min(1).required(),
  description: Joi.string().max(500).allow(''),
});

const updateServiceSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  price: Joi.number().min(0),
  duration: Joi.number().min(1),
  description: Joi.string().max(500).allow(''),
});

const getServicesByBarber = async (req, res) => {
  try {
    const services = await Service.find({ barberId: req.params.barberId });
    return res.status(200).json({ success: true, data: services });
  } catch (error) {
    console.error('GetServicesByBarber error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const createService = async (req, res) => {
  try {
    const { error, value } = createServiceSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const barber = await Barber.findById(value.barberId);
    if (!barber) {
      return res.status(404).json({ success: false, message: 'Barber not found' });
    }

    if (req.user.role !== 'admin') {
      const myBarber = await Barber.findOne({ userId: req.user._id });
      if (!myBarber || myBarber._id.toString() !== value.barberId) {
        return res.status(403).json({ success: false, message: 'Not authorized to add services for this barber' });
      }
    }

    const service = await Service.create(value);
    return res.status(201).json({ success: true, data: service });
  } catch (error) {
    console.error('CreateService error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateService = async (req, res) => {
  try {
    const { error, value } = updateServiceSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    if (req.user.role !== 'admin') {
      const myBarber = await Barber.findOne({ userId: req.user._id });
      if (!myBarber || myBarber._id.toString() !== service.barberId.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to update this service' });
      }
    }

    const updated = await Service.findByIdAndUpdate(req.params.id, value, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error('UpdateService error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    if (req.user.role !== 'admin') {
      const myBarber = await Barber.findOne({ userId: req.user._id });
      if (!myBarber || myBarber._id.toString() !== service.barberId.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to delete this service' });
      }
    }

    await Service.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.error('DeleteService error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getServicesByBarber, createService, updateService, deleteService };
