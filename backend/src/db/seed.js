require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');

const User = require('../models/User');
const Barber = require('../models/Barber');
const Service = require('../models/Service');
const Booking = require('../models/Booking');
const Expense = require('../models/Expense');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected for seeding');
};

const clearDB = async () => {
  await Promise.all([
    User.deleteMany({}),
    Barber.deleteMany({}),
    Service.deleteMany({}),
    Booking.deleteMany({}),
    Expense.deleteMany({}),
  ]);
  console.log('Database cleared');
};

const seed = async () => {
  await connectDB();
  await clearDB();

  // ==================== USERS ====================
  // Admin
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@gmail.com',
    password: 'admin123',
    role: 'admin',
    styleCoins: 0,
  });

  // Barber users
  const barberUser1 = await User.create({
    name: 'Jasur Karimov',
    email: 'jasur@trimflow.com',
    password: 'barber123',
    role: 'barber',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  });

  const barberUser2 = await User.create({
    name: 'Bobur Toshmatov',
    email: 'bobur@trimflow.com',
    password: 'barber123',
    role: 'barber',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
  });

  const barberUser3 = await User.create({
    name: 'Sanjar Yusupov',
    email: 'sanjar@trimflow.com',
    password: 'barber123',
    role: 'barber',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
  });

  // Client users
  const client1 = await User.create({
    name: 'Alisher Nazarov',
    email: 'alisher@client.com',
    password: 'client123',
    role: 'client',
    styleCoins: 50,
  });

  const client2 = await User.create({
    name: 'Dilshod Rahimov',
    email: 'dilshod@client.com',
    password: 'client123',
    role: 'client',
    styleCoins: 30,
  });

  const client3 = await User.create({
    name: 'Kamol Ergashev',
    email: 'kamol@client.com',
    password: 'client123',
    role: 'client',
    styleCoins: 20,
  });

  console.log('Users created');

  // ==================== BARBERS ====================
  const barber1 = await Barber.create({
    userId: barberUser1._id,
    bio: "Men 8 yillik tajribaga ega professional sartaroshman. Klassik va zamonaviy soch turmaklanishida mutaxassisман.",
    workingHours: { start: '09:00', end: '18:00' },
    rating: 4.8,
    totalReviews: 120,
    isVerified: true,
    portfolio: [
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400',
      'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400',
    ],
  });

  const barber2 = await Barber.create({
    userId: barberUser2._id,
    bio: "Zamonaviy soch turmaklanishi va soqol olishda mutaxassis. Har bir mijozga individual yondashuv.",
    workingHours: { start: '10:00', end: '19:00' },
    rating: 4.6,
    totalReviews: 85,
    isVerified: true,
    portfolio: [
      'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400',
      'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400',
    ],
  });

  const barber3 = await Barber.create({
    userId: barberUser3._id,
    bio: "Yoshlar orasida mashhur trend haircut va styling mutaxassisi. Ijodiy yondashuvim bilan ajralib turaman.",
    workingHours: { start: '08:00', end: '17:00' },
    rating: 4.9,
    totalReviews: 200,
    isVerified: true,
    portfolio: [
      'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=400',
      'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400',
    ],
  });

  console.log('Barbers created');

  // ==================== SERVICES ====================
  // Barber 1 services
  const b1s1 = await Service.create({ barberId: barber1._id, name: "Klassik soch olish", price: 50000, duration: 30, description: "An'anaviy klassik soch turmaklanishi" });
  const b1s2 = await Service.create({ barberId: barber1._id, name: "Soqol olish", price: 30000, duration: 20, description: "Professional soqol olish va shakllantirish" });
  const b1s3 = await Service.create({ barberId: barber1._id, name: "Soch va soqol to'liq", price: 75000, duration: 50, description: "Soch olish va soqol to'liq xizmati" });
  const b1s4 = await Service.create({ barberId: barber1._id, name: "Soch bo'yash", price: 120000, duration: 90, description: "Professional soch bo'yash xizmati" });

  // Barber 2 services
  const b2s1 = await Service.create({ barberId: barber2._id, name: "Fade soch olish", price: 60000, duration: 40, description: "Zamonaviy fade va taper soch turmaklanishi" });
  const b2s2 = await Service.create({ barberId: barber2._id, name: "Soqol shakllantirish", price: 35000, duration: 25, description: "Soqol va mustachio shakllantirish" });
  const b2s3 = await Service.create({ barberId: barber2._id, name: "Kids soch olish", price: 40000, duration: 25, description: "Bolalar uchun soch turmaklanishi" });
  const b2s4 = await Service.create({ barberId: barber2._id, name: "Soch yuvish + fen", price: 25000, duration: 20, description: "Soch yuvish va fen bilan quritish" });

  // Barber 3 services
  const b3s1 = await Service.create({ barberId: barber3._id, name: "Trend haircut", price: 70000, duration: 45, description: "Eng zamonaviy trend soch turmaklash" });
  const b3s2 = await Service.create({ barberId: barber3._id, name: "Tekstura va styling", price: 55000, duration: 35, description: "Soch teksturasini shakllantirish va styling" });
  const b3s3 = await Service.create({ barberId: barber3._id, name: "Soqol dizayn", price: 45000, duration: 30, description: "Kreativ soqol dizayn va shakllantirish" });

  console.log('Services created');

  // ==================== BOOKINGS ====================
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const bookingsData = [
    {
      clientId: client1._id,
      barberId: barber1._id,
      serviceId: b1s1._id,
      startTime: new Date(today.getTime() + 9 * 60 * 60 * 1000), // 09:00
      endTime: new Date(today.getTime() + 9.5 * 60 * 60 * 1000), // 09:30
      status: 'confirmed',
    },
    {
      clientId: client2._id,
      barberId: barber1._id,
      serviceId: b1s3._id,
      startTime: new Date(today.getTime() + 11 * 60 * 60 * 1000), // 11:00
      endTime: new Date(today.getTime() + 11.833 * 60 * 60 * 1000), // 11:50
      status: 'pending',
    },
    {
      clientId: client3._id,
      barberId: barber2._id,
      serviceId: b2s1._id,
      startTime: new Date(today.getTime() + 10 * 60 * 60 * 1000), // 10:00
      endTime: new Date(today.getTime() + 10.666 * 60 * 60 * 1000), // 10:40
      status: 'confirmed',
    },
    {
      clientId: client1._id,
      barberId: barber2._id,
      serviceId: b2s2._id,
      startTime: new Date(today.getTime() + 14 * 60 * 60 * 1000), // 14:00
      endTime: new Date(today.getTime() + 14.416 * 60 * 60 * 1000), // 14:25
      status: 'pending',
    },
    {
      clientId: client2._id,
      barberId: barber3._id,
      serviceId: b3s1._id,
      startTime: new Date(today.getTime() + 12 * 60 * 60 * 1000), // 12:00
      endTime: new Date(today.getTime() + 12.75 * 60 * 60 * 1000), // 12:45
      status: 'confirmed',
    },
    // Past bookings (completed)
    {
      clientId: client1._id,
      barberId: barber1._id,
      serviceId: b1s2._id,
      startTime: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000),
      endTime: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000 + 10.333 * 60 * 60 * 1000),
      status: 'completed',
      styleCoinEarned: 10,
    },
    {
      clientId: client3._id,
      barberId: barber3._id,
      serviceId: b3s2._id,
      startTime: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000 + 15 * 60 * 60 * 1000),
      endTime: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000 + 15.583 * 60 * 60 * 1000),
      status: 'completed',
      styleCoinEarned: 10,
    },
    {
      clientId: client2._id,
      barberId: barber2._id,
      serviceId: b2s3._id,
      startTime: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000 + 11 * 60 * 60 * 1000),
      endTime: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000 + 11.416 * 60 * 60 * 1000),
      status: 'completed',
      styleCoinEarned: 10,
    },
    // Cancelled booking
    {
      clientId: client3._id,
      barberId: barber1._id,
      serviceId: b1s4._id,
      startTime: new Date(today.getTime() + 16 * 60 * 60 * 1000),
      endTime: new Date(today.getTime() + 17.5 * 60 * 60 * 1000),
      status: 'cancelled',
    },
  ];

  const bookings = await Booking.insertMany(bookingsData);
  console.log(`${bookings.length} bookings created`);

  // ==================== EXPENSES ====================
  await Expense.insertMany([
    { barberId: barber1._id, description: "Soch olish anjomlar (makayij)", amount: 150000, date: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000) },
    { barberId: barber1._id, description: "Ish joyi ijarasi (oylik)", amount: 500000, date: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000) },
    { barberId: barber2._id, description: "Yangi sartaroshlik kreslosi", amount: 800000, date: new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000) },
    { barberId: barber2._id, description: "Ish joyi ijarasi", amount: 450000, date: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000) },
    { barberId: barber3._id, description: "Soch parvarish mahsulotlari", amount: 200000, date: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000) },
    { barberId: barber3._id, description: "Reklama xarajatlari", amount: 100000, date: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000) },
  ]);

  console.log('Expenses created');

  console.log('\n========== SEED COMPLETED ==========');
  console.log('Admin credentials:');
  console.log('  Email: admin@gmail.com');
  console.log('  Password: admin123');
  console.log('\nBarber credentials (all use password: barber123):');
  console.log('  jasur@trimflow.com');
  console.log('  bobur@trimflow.com');
  console.log('  sanjar@trimflow.com');
  console.log('\nClient credentials (all use password: client123):');
  console.log('  alisher@client.com');
  console.log('  dilshod@client.com');
  console.log('  kamol@client.com');
  console.log('=====================================\n');

  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((error) => {
  console.error('Seed error:', error);
  mongoose.connection.close();
  process.exit(1);
});
