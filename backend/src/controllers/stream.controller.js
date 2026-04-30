const Booking = require('../models/Booking');

const streamQueue = async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
  res.flushHeaders();

  const sendTodayBookings = async () => {
    try {
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfToday = new Date(startOfToday);
      endOfToday.setDate(endOfToday.getDate() + 1);

      const bookings = await Booking.find({
        startTime: { $gte: startOfToday, $lt: endOfToday },
        status: { $in: ['pending', 'confirmed'] },
      })
        .populate('clientId', 'name avatar')
        .populate({ path: 'barberId', populate: { path: 'userId', select: 'name' } })
        .populate('serviceId', 'name duration price')
        .sort({ startTime: 1 })
        .lean();

      res.write(`data: ${JSON.stringify({ type: 'queue', bookings, timestamp: new Date().toISOString() })}\n\n`);
    } catch (error) {
      console.error('SSE sendTodayBookings error:', error);
      res.write(`data: ${JSON.stringify({ type: 'error', message: 'Failed to fetch queue' })}\n\n`);
    }
  };

  // Send immediately on connect
  await sendTodayBookings();

  // Then every 30 seconds
  const interval = setInterval(sendTodayBookings, 30000);

  // Send heartbeat every 15 seconds to keep connection alive
  const heartbeat = setInterval(() => {
    res.write(': heartbeat\n\n');
  }, 15000);

  req.on('close', () => {
    clearInterval(interval);
    clearInterval(heartbeat);
    res.end();
  });
};

module.exports = { streamQueue };
