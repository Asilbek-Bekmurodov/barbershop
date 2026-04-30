require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/db');
const User = require('./models/User');
const Barber = require('./models/Barber');
require('./config/passport');

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const barberRoutes = require('./routes/barber.routes');
const serviceRoutes = require('./routes/service.routes');
const bookingRoutes = require('./routes/booking.routes');
const financeRoutes = require('./routes/finance.routes');
const adminRoutes = require('./routes/admin.routes');
const chatRoutes = require('./routes/chat.routes');
const streamRoutes = require('./routes/stream.routes');
const healthRoutes = require('./routes/health.routes');

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Make io accessible from controllers via req.app.get('io')
app.set('io', io);

// Connect to MongoDB
connectDB();

// Middleware
const corsOptions = {
  origin: (origin, callback) => {
    const allowed = [
      'http://localhost:3000',
      'http://localhost:3001',
      process.env.FRONTEND_URL,
    ].filter(Boolean);
    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: ${origin} not allowed`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
app.options('/*splat', cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/barbers', barberRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/stream', streamRoutes);
app.use('/api/health', healthRoutes);

// 404 handler
app.use('/*splat', (req, res) => {
  return res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err.stack);
  return res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Socket.io connection handling
io.use(async (socket, next) => {
  try {
    const authHeader = socket.handshake.headers.authorization;
    let token = socket.handshake.auth?.token;

    if (!token && authHeader?.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      return next(new Error('Unauthorized'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.isBlocked) {
      return next(new Error('Unauthorized'));
    }

    socket.user = user;
    return next();
  } catch (error) {
    return next(new Error('Unauthorized'));
  }
});

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.join(`client:${socket.user._id}`);
  if (socket.user.role === 'admin') {
    socket.join('admin');
  }

  socket.on('join:barber', async (barberId) => {
    if (socket.user.role === 'admin') {
      socket.join(`barber:${barberId}`);
      return;
    }

    if (socket.user.role !== 'barber') {
      socket.emit('room:error', { message: 'Not authorized for this barber room' });
      return;
    }

    const barber = await Barber.findOne({ userId: socket.user._id });
    if (!barber || barber._id.toString() !== barberId) {
      socket.emit('room:error', { message: 'Not authorized for this barber room' });
      return;
    }

    socket.join(`barber:${barberId}`);
    console.log(`Socket ${socket.id} joined barber:${barberId}`);
  });

  socket.on('join:client', (clientId) => {
    if (socket.user.role !== 'admin' && socket.user._id.toString() !== clientId) {
      socket.emit('room:error', { message: 'Not authorized for this client room' });
      return;
    }

    socket.join(`client:${clientId}`);
    console.log(`Socket ${socket.id} joined client:${clientId}`);
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`TrimFlow server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

module.exports = { app, server, io };
