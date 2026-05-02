# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Loyiha: TrimFlow (Barbershop Terminal)

Real-time navbat boshqaruvi, AI chat yordamchisi (TrimAgent) va moliyaviy analitikaga ega sartaroshxona platformasi. Loyiha to'liq **Coding Agents** jamoasi tomonidan yaratilgan.

## Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Zustand
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), Socket.io
- **Auth:** JWT + Google OAuth (Passport.js)
- **Real-time:** Socket.io (bookings) + SSE (`/api/stream/queue`)
- **LLM:** OpenRouter (gpt-oss-120b via LiteLLM) — `LLM_MOCK=true` bilan test qilinadi
- **Rasm:** Cloudinary

## Komandalar

### Frontend (`/frontend`)
```bash
npm run dev      # http://localhost:3000
npm run build    # Production build
npm run lint     # ESLint
```

### Backend (`/backend`)
```bash
npm run dev      # nodemon, http://localhost:5000
npm start        # Production
npm run seed     # DB ga test ma'lumotlar kiritish
```

### Admin kirish (seed dan so'ng)
```
Email: admin@gmail.com | Parol: admin123
```

## Loyiha Strukturasi

```
trimflow/
├── frontend/src/
│   ├── app/                    # Next.js App Router sahifalari
│   │   ├── page.tsx            # Landing page
│   │   ├── auth/login|register # Auth sahifalari
│   │   └── dashboard/
│   │       ├── barbers/        # Sartaroshlar ro'yxati (client)
│   │       ├── booking/[id]/   # Bron qilish (client)
│   │       ├── barber/         # Sartarosh dashboard (P&L, navbat)
│   │       ├── admin/          # Admin panel (CRUD, stats)
│   │       └── profile/        # Foydalanuvchi profili
│   ├── components/
│   │   ├── ui/                 # Button, Card, Badge, Input, LoadingSpinner
│   │   ├── layout/Header.tsx   # Global header
│   │   ├── ai/TrimAgentChat.tsx # AI chat sliding sidebar
│   │   └── booking/TimeSlotGrid.tsx
│   ├── store/                  # Zustand: useAuthStore, useBookingStore, useChatStore
│   ├── lib/api.ts              # Axios instance (NEXT_PUBLIC_API_URL)
│   └── types/index.ts          # TypeScript interfacelar
│
├── backend/src/
│   ├── server.js               # Express + Socket.io + routes
│   ├── config/db.js            # MongoDB ulanish
│   ├── models/                 # User, Barber, Service, Booking, ChatMessage, Expense
│   ├── controllers/            # Har bir endpoint mantigi
│   ├── routes/                 # auth, user, barber, service, booking, finance, admin, chat, stream
│   ├── middleware/auth.js      # JWT protect + role authorize
│   └── db/seed.js              # Test ma'lumotlar
│
└── planning/
    ├── PLAN.md                 # To'liq loyiha spetsifikatsiyasi
    └── RULES.md                # Kodlash qoidalari
```

## Arxitektura

**Data flow:** Frontend → Axios (`/api/*`) → Express → Mongoose → MongoDB  
**Real-time:** Socket.io (booking o'zgarganda) + SSE (`/api/stream/queue` har 30 sek)  
**Auth:** JWT Bearer token → `protect` middleware → `authorize(role)` middleware  
**AI:** POST `/api/chat` → context yig'iladi → OpenRouter/mock → JSON parse → auto-execute bookings

## Dizayn Tizimi

| Token | Qiymat | Ishlatilishi |
|-------|--------|--------------|
| `trim-bg` | `#0d1117` | Asosiy fon |
| `trim-border` | `#30363d` | Chegaralar |
| `trim-yellow` | `#ecad0a` | Logo, accent, StyleCoins |
| `trim-blue` | `#209dd7` | Ko'k elementlar, grafik |
| `trim-purple` | `#753991` | Action tugmalar, AI chat |
| `trim-green` | `#3fb950` | Muvaffaqiyat, daromad |

Shrift: `Roboto Mono` (ma'lumotlar, raqamlar) + `Inter` (matn)

## Rollar va Huquqlar

| Rol | Imkoniyatlar |
|-----|-------------|
| `client` | Bron qilish, profil, AI chat |
| `barber` | Dashboard, jadval, P&L, xizmatlar CRUD |
| `admin` | Barcha CRUD, foydalanuvchilarni boshqarish, tasdiqlash |

## LLM (TrimAgent) JSON Formati

```json
{
  "message": "Foydalanuvchiga javob",
  "bookings": [{ "barber_id": "...", "action": "create", "time": "ISO", "service_name": "..." }],
  "coin_transactions": [{ "amount": 10, "type": "earn", "reason": "..." }],
  "recommendations": [{ "style": "Fade", "reason": "..." }]
}
```

`LLM_MOCK=true` bo'lsa OpenRouter chaqirilmaydi, mock javob qaytariladi.

## Muhit O'zgaruvchilari

Frontend: `.env.local` — `NEXT_PUBLIC_API_URL=http://localhost:5000/api`  
Backend: `.env` — `.env.example` fayliga qarang

## Har Bir Qilingan Ish

- [x] Frontend: Landing, Auth (login/register), Barbers list, Booking page, Barber dashboard, Admin panel, Profile
- [x] Frontend: UI komponentlar (Button, Card, Badge, Input, Spinner), Header, TrimAgent AI chat sidebar
- [x] Frontend: Zustand stores (auth, booking, chat), Axios API client, TypeScript types
- [x] Backend: Express server + Socket.io, barcha routes va controllers
- [x] Backend: MongoDB models (User, Barber, Service, Booking, ChatMessage, Expense)
- [x] Backend: JWT auth middleware, Google OAuth (Passport), DB seeder
- [x] Build: `npm run build` — 10/10 sahifa xatosiz


