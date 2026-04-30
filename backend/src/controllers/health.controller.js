const mongoose = require('mongoose');

const ping = (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const dbStatusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  return res.status(200).json({
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: dbStatusMap[dbStatus] || 'unknown',
      environment: process.env.NODE_ENV || 'development',
    },
  });
};

module.exports = { ping };
