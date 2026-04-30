const https = require('https');
const Joi = require('joi');
const ChatMessage = require('../models/ChatMessage');
const Barber = require('../models/Barber');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const User = require('../models/User');

const chatSchema = Joi.object({
  message: Joi.string().min(1).max(2000).required(),
});

const MOCK_RESPONSE = {
  reply: "Salom! Men TrimFlow yordamchisiman. Sizga qanday yordam bera olaman? Sartarosh haqida ma'lumot olish, bron qilish yoki xizmatlar haqida so'rashingiz mumkin.",
  bookings: [],
  coin_transactions: [],
  recommendations: [],
};

const callOpenRouter = async (messages) => {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      model: process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.1-8b-instruct',
      messages,
      response_format: { type: 'json_object' },
    });

    const options = {
      hostname: 'openrouter.ai',
      path: '/api/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:3000',
        'X-Title': 'TrimFlow Barbershop',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) {
            return reject(new Error(parsed.error.message || 'OpenRouter API error'));
          }
          const content = parsed.choices[0].message.content;
          resolve(JSON.parse(content));
        } catch (e) {
          reject(new Error('Failed to parse LLM response'));
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
};

const chat = async (req, res) => {
  try {
    const { error, value } = chatSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const { message } = value;
    const userId = req.user._id;

    // Save user message
    await ChatMessage.create({ userId, role: 'user', content: message });

    // Gather context
    const user = await User.findById(userId);
    const barbers = await Barber.find({ isVerified: true })
      .populate('userId', 'name avatar')
      .lean();

    const barbersWithServices = await Promise.all(
      barbers.map(async (b) => {
        const services = await Service.find({ barberId: b._id }).lean();
        return { ...b, services };
      })
    );

    const myBookings = await Booking.find({ clientId: userId, status: { $in: ['pending', 'confirmed'] } })
      .populate('serviceId', 'name price duration')
      .populate({ path: 'barberId', populate: { path: 'userId', select: 'name' } })
      .lean();

    // Get chat history (last 10 messages)
    const history = await ChatMessage.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const historyMessages = history.reverse().map((m) => ({
      role: m.role,
      content: m.content,
    }));

    let llmResponse;

    if (process.env.LLM_MOCK === 'true') {
      llmResponse = MOCK_RESPONSE;
    } else {
      const systemPrompt = `Sen TrimFlow barbershop platformasining aqlli yordamchisisan.

Sartaroshlar: ${JSON.stringify(barbersWithServices.map(b => ({
  id: b._id,
  name: b.userId?.name,
  services: b.services,
  rating: b.rating,
  workingHours: b.workingHours,
})))}

Foydalanuvchi: ${JSON.stringify({ name: user.name, styleCoins: user.styleCoins })}

Faol bronlar: ${JSON.stringify(myBookings)}

Bugungi sana: ${new Date().toISOString()}

Javob formatini FAQAT quyidagi JSON formatida ber:
{
  "reply": "Foydalanuvchiga javobing (uzbekcha)",
  "bookings": [
    {
      "barberId": "id",
      "serviceId": "id",
      "startTime": "ISO date string"
    }
  ],
  "coin_transactions": [
    {
      "userId": "id",
      "amount": number,
      "reason": "sabab"
    }
  ],
  "recommendations": ["tavsiya 1", "tavsiya 2"]
}

bookings va coin_transactions massivlari faqat zarur bo'lganda to'ldirilsin.`;

      const messages = [
        { role: 'system', content: systemPrompt },
        ...historyMessages.slice(-8),
        { role: 'user', content: message },
      ];

      try {
        llmResponse = await callOpenRouter(messages);
      } catch (llmError) {
        console.error('LLM error, using mock:', llmError.message);
        llmResponse = {
          reply: "Kechirasiz, hozir AI xizmatida muammo bor. Iltimos, keyinroq urinib ko'ring.",
          bookings: [],
          coin_transactions: [],
          recommendations: [],
        };
      }
    }

    const { reply, bookings = [], coin_transactions = [], recommendations = [] } = llmResponse;

    // Auto-create bookings if LLM suggested them
    const createdBookings = [];
    for (const b of bookings) {
      try {
        const service = await Service.findById(b.serviceId);
        if (!service) continue;

        const startDate = new Date(b.startTime);
        const endDate = new Date(startDate.getTime() + service.duration * 60 * 1000);

        const overlap = await Booking.findOne({
          barberId: b.barberId,
          status: { $in: ['pending', 'confirmed'] },
          $or: [{ startTime: { $lt: endDate }, endTime: { $gt: startDate } }],
        });

        if (overlap) continue;

        const newBooking = await Booking.create({
          clientId: userId,
          barberId: b.barberId,
          serviceId: b.serviceId,
          startTime: startDate,
          endTime: endDate,
        });
        createdBookings.push(newBooking);

        const io = req.app.get('io');
        if (io) io.emit('booking:new', newBooking);
      } catch (bookingErr) {
        console.error('Auto-booking error:', bookingErr.message);
      }
    }

    // Process coin transactions
    for (const ct of coin_transactions) {
      try {
        if (ct.amount && ct.userId) {
          await User.findByIdAndUpdate(ct.userId, {
            $inc: { styleCoins: ct.amount },
          });
        }
      } catch (coinErr) {
        console.error('Coin transaction error:', coinErr.message);
      }
    }

    // Save assistant message
    const assistantMsg = await ChatMessage.create({
      userId,
      role: 'assistant',
      content: reply,
      metadata: { bookings: createdBookings, coin_transactions, recommendations },
    });

    return res.status(200).json({
      success: true,
      data: {
        message: assistantMsg,
        createdBookings,
        recommendations,
      },
    });
  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { chat };
