# TrimFlow — Loyiha Spetsifikatsiyasi

## 1. Vision

TrimFlow — zamonaviy sartaroshxonalar uchun mo'ljallangan raqamli platforma. Mijozlar qulay tarzda bron qiladi, sartaroshlar ish jadvalini nazorat qiladi, admin esa butun tizimni boshqaradi.

---

## 2. UX

### 1. Landing Page (Ommaviy Sahifa) va Avtorizatsiya

Yangi tashrif buyuruvchiga platformani tanishtiruvchi sahifa. Ro'yxatdan o'tish va kirish imkoniyatlari (Email/Parol yoki Google OAuth).

---

### 2. Foydalanuvchi (Client) Rolining Imkoniyatlari

Foydalanuvchi tizimga muvaffaqiyatli kirgach, uni interaktiv va qulay ekotizim kutib oladi:

- **Sartaroshlar Katalogi:** Asosiy sahifada sartaroshlarning e'lonlari, reytingi va qisqacha portfoliolari chiroyli kartochkalar (cards) ko'rinishida chiqib turadi.
- **Xizmatni Tanlash:** Biror sartaroshni tanlagach, uning shaxsiy sahifasi ochiladi. U yerda xizmatlar ro'yxati (soch qisqartirish, soqol tekislash va h.k.) va narxlar ko'rinadi.
- **Interaktiv Ish Jadvali (Smart Booking):** Xizmat tanlangach, sartaroshning ish jadvali ekranga chiqadi.
  - **UX Yechim:** Vaqtlar 8:00 dan 18:00 gacha bo'lingan **1 soatlik slotlar** ko'rinishida taqdim etiladi.
  - Boshqa mijozlar tomonidan band qilingan vaqtlar kulrang (o'chiq) rangda, bo'sh vaqtlar esa yashil (faol) rangda ko'rsatiladi. Foydalanuvchi bo'sh slotni tanlashi bilan real vaqtda o'zgarish sodir bo'ladi.
- **Mijoz Profili:** Profil bo'limida foydalanuvchi o'z rasmini yuklay oladi, ism-familiyasini tahrirlaydi.
  - **Bronlar Tarixi:** Faol va o'tgan bronlar ro'yxati. Bu yerda sartaroshning ismi, xizmat turi, tanlangan sana va vaqt (masalan: _14:00 - 15:00_) yaqqol ko'rinib turadi.
- **Eslatmalar (Reminders):** Mijozning bron qilingan vaqtiga aynan 1 soat qolganda tizim avtomatik ravishda bildirishnoma yuboradi.

---

### 3. Sartarosh (Barber) Rolining Imkoniyatlari

Sartarosh sifatida ro'yxatdan o'tgan foydalanuvchi uchun maxsus boshqaruv paneli (Dashboard) ochiladi:

- **Profil va Xizmatlar Sozlamalari:** Sartarosh o'zi taqdim etadigan xizmatlarni (nomi, narxi, davomiyligi) qo'sha, tahrirlash va o'chirishishi mumkin.
- **Ish Vaqti Sozlamalari:** Standart ish vaqtini (masalan: 08:00–18:00) belgilash imkoniyati.
- **Navbatlar Paneli (Queue Panel):** Bugungi bronlar ro'yxati — mijoz ismi, xizmat turi, vaqti va holati (Kutilmoqda / Keldi / Bajarildi) ko'rinadi.
- **Daromad Hisoboti:** Kunlik va oylik daromad statistikasi — qancha mijoz xizmatlanganini, umumiy tushumni oddiy ko'rinishda taqdim etadi.

---

### 4. Administrator (Admin) Rolining Imkoniyatlari

Platformani to'liq nazorat qilish uchun mo'ljallangan yopiq tizim. Admin akkaunti bazaga oldindan (seeder orqali) kiritilgan bo'ladi:

- **Kredensiallar:** Email: `admin@gmail.com` | Parol: `admin123`
- **Bosh Panel (Dashboard):** Sayt yuklanganda barcha tizim statistikasi chiqadi: umumiy foydalanuvchilar soni, faol sartaroshlar soni, kunlik bronlar soni.
- **To'liq CRUD Operatsiyalar:** Admin barcha jadvallar ustidan to'liq nazoratga ega:
  - Mijozlar ro'yxatini ko'rish, tahrirlash, bloklash.
  - Sartaroshlar akkauntlarini tasdiqlash, ro'yxatdan o'chirish.
  - Xizmatlar va tizim sozlamalarini boshqarish.

---

## 3. Vizual Kontseptsiya

Loyiha dizayni aniq, zamonaviy va barbershop atmosferasini his ettiruvchi bo'ladi.

### Ranglar sxemasi va Mavzu

- **Fon (Background):** `#0d1117` — ko'zni charchatmaydigan chuqur to'q fon.
- **Chegaralar (Borders):** `#30363d` — xira kulrang, bloklarni ajratish uchun.
- **Urg'u beruvchi Sariq (Accent Yellow):** `#ecad0a` — logotip, ikonkalar va muhim statuslar uchun.
- **Asosiy Ko'k (Blue Primary):** `#209dd7` — navigatsiya va jadval elementlari uchun.
- **Harakat Tugmalari (Action Purple):** `#753991` — "Bron qilish" va asosiy harakat tugmalari uchun.

---

## 4. Loyiha Arxitekturasi

```
trimflow/
├── frontend/                 # Next.js TypeScript
├── backend/                  # Node.js (Business Logic & Real-time)
├── planning/                 # Loyiha hujjatlari
│   ├── PLAN.md               # Asosiy yo'l xaritasi
│   ├── ARCHITECTURE.md       # Tizim dizayni va ma'lumotlar oqimi
│   └── API_SPEC.md           # Backend va Frontend o'rtasidagi kelishuv
├── test/                     # Playwright E2E testlari
├── db/                       # MongoDB sxemalari va seederlar
├── scripts/                  # Loyihani ishga tushirish (setup.sh, start.sh)
├── .env                      # Maxfiy kalitlar (MongoDB URI, Google Auth)
└── .gitignore
```

---

## 5. Modullarning Vazifalari va Chegaralari

### 1. Frontend (Next.js & TypeScript)

Ushbu qatlam faqat vizualizatsiya va foydalanuvchi tajribasi (UX) uchun javobgar.

- **Mustaqillik:** Backend ichki mantiqini bilishi shart emas.
- **Aloqa:** Ma'lumotlarni `/api/*` (REST) va real vaqt o'zgarishlarni `/api/stream/*` (SSE/WebSocket) orqali oladi.
- **Dizayn:** Dark professional uslub (#0d1117 fon, sariq va ko'k urg'ular) aynan shu qatlamda amalga oshiriladi.

### 2. Backend (Node.js)

Loyihaning asosiy mantiq qatlami.

- Barcha hisob-kitoblar, validatsiya va API marshrutlarini boshqaradi.
- MongoDB bilan bevosita muloqot qiladi.
- Google OAuth va rollarga asoslangan (Admin, Barber, Client) kirish tizimini boshqaradi.
- Socket.io orqali real vaqt bildirishnomalarini yuboradi.

### 3. Planning (Hujjatlar Markazi)

Bu papka frontend, backend va QA agentlari uchun **"asosiy manba"** vazifasini o'taydi. Har qanday o'zgarish avval `planning/` ichidagi hujjatlar bilan solishtirilib, keyin kodga kiritiladi.

---

## 6. Asosiy Texnik Qoidalar

- **Real-time First:** Navbatlar va jadval holati jonli (live) oqim sifatida backenddan frontendga uzatiladi.
- **State Management:** Frontendda `Zustand` yordamida navbat holati va bildirishnomalar doimiy sinxronizatsiyada bo'ladi.
- **Testing:** `test/` papkasidagi Playwright skriptlari haqiqiy foydalanuvchi kabi brauzerni ochib, login va bron qilish jarayonini avtomatik tekshiradi.

---

## 7. Muhit O'zgaruvchilari (Environment Variables)

```bash
# --- SERVER CONFIGURATION ---
PORT=5000
NODE_ENV=development

# --- DATABASE (MongoDB) ---
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/trimflow?retryWrites=true&w=majority

# --- AUTHENTICATION (JWT & Google OAuth) ---
JWT_SECRET=your_super_secret_jwt_key_here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# --- AI & LLM (OpenRouter) ---
OPENROUTER_API_KEY=your-openrouter-api-key-here

# --- ASSETS MANAGEMENT (Cloudinary) ---
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# --- FRONTEND LINKING ---
FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# --- LLM MOCK (Testing) ---
LLM_MOCK=false
```

### Xavfsizlik Qoidalari

1. `.env` fayli hech qachon GitHub repozitoriyasiga chiqib ketmasligi shart. Faqat `.env.example` andoza sifatida saqlanadi.
2. **Cloudinary:** Rasm yuklananda to'g'ridan-to'g'ri Cloudinary'ga borib, bazada faqat URL saqlanadi.
3. **OpenRouter:** TrimAgent (AI yordamchi) mijozlarga stil tavsiya qilish va sartaroshlarga daromad tahlilini tushuntirish uchun ishlatiladi.

---

## 8. Ma'lumotlar Bazasi (Database) — API Endpointlari

### 1. Avtorizatsiya va Foydalanuvchi (Auth & Users)

| Metod      | Yo'l (Path)          | Tavsif                                       | Roli   |
| ---------- | -------------------- | -------------------------------------------- | ------ |
| **POST**   | `/api/auth/register` | Yangi foydalanuvchi yaratish                 | Public |
| **POST**   | `/api/auth/login`    | Email/Password orqali kirish                 | Public |
| **GET**    | `/api/auth/google`   | Google OAuth orqali kirish                   | Public |
| **GET**    | `/api/users/me`      | Joriy foydalanuvchi profilini olish          | All    |
| **PUT**    | `/api/users/profile` | Profil ma'lumotlarini tahrirlash (ism, rasm) | All    |
| **DELETE** | `/api/users/me`      | O'z akkauntini o'chirish                     | All    |

### 2. Sartaroshlar (Barber CRUD)

| Metod      | Yo'l (Path)        | Tavsif                                             | Roli             |
| ---------- | ------------------ | -------------------------------------------------- | ---------------- |
| **GET**    | `/api/barbers`     | Barcha tasdiqlangan sartaroshlarni ko'rish         | Public           |
| **GET**    | `/api/barbers/:id` | Bitta sartaroshning to'liq ma'lumotlarini olish    | Public           |
| **POST**   | `/api/barbers`     | Sartaroshlik profilini yaratish                    | Client -> Barber |
| **PUT**    | `/api/barbers/me`  | O'z ish vaqti va profil ma'lumotlarini tahrirlash  | Barber           |
| **DELETE** | `/api/barbers/:id` | Sartaroshlik profilini o'chirish                   | Admin            |

### 3. Xizmatlar (Services CRUD)

| Metod      | Yo'l (Path)               | Tavsif                                          | Roli   |
| ---------- | ------------------------- | ----------------------------------------------- | ------ |
| **GET**    | `/api/services/:barberId` | Muayyan sartaroshning barcha xizmatlarini olish | All    |
| **POST**   | `/api/services`           | Yangi xizmat turini qo'shish                    | Barber |
| **PUT**    | `/api/services/:id`       | Xizmat narxi yoki nomini tahrirlash             | Barber |
| **DELETE** | `/api/services/:id`       | Xizmatni o'chirib tashlash                      | Barber |

### 4. Bron Qilish Tizimi (Bookings CRUD)

| Metod      | Yo'l (Path)         | Tavsif                                                   | Roli            |
| ---------- | ------------------- | -------------------------------------------------------- | --------------- |
| **GET**    | `/api/bookings`     | Barcha bronlarni ko'rish (Filtrlar bilan)                | Admin           |
| **GET**    | `/api/bookings/my`  | O'zining bronlar ro'yxatini olish                        | Client / Barber |
| **POST**   | `/api/bookings`     | Yangi vaqtni bron qilish                                 | Client          |
| **PATCH**  | `/api/bookings/:id` | Bron holatini o'zgartirish (Completed / Cancelled)       | Barber / Client |
| **DELETE** | `/api/bookings/:id` | Bronni tizimdan butunlay o'chirish                       | Admin           |

### 5. Daromad va Xarajatlar (Finance CRUD)

| Metod      | Yo'l (Path)                | Tavsif                                               | Roli   |
| ---------- | -------------------------- | ---------------------------------------------------- | ------ |
| **GET**    | `/api/finance/stats`       | Umumiy daromad va xarajat statistikasi               | Barber |
| **POST**   | `/api/finance/expense`     | Qo'lda xarajat kiritish (masalan: asbob sotib olish) | Barber |
| **PUT**    | `/api/finance/expense/:id` | Xarajat yozuvini tahrirlash                          | Barber |
| **DELETE** | `/api/finance/expense/:id` | Xarajat yozuvini o'chirish                           | Barber |

### 6. Admin Boshqaruv Paneli

| Metod    | Yo'l (Path)                   | Tavsif                                             | Roli  |
| -------- | ----------------------------- | -------------------------------------------------- | ----- |
| **GET**  | `/api/admin/dashboard`        | Global statistika (Users, Revenue, Bookings count) | Admin |
| **GET**  | `/api/admin/users`            | Tizimdagi barcha foydalanuvchilar ro'yxati         | Admin |
| **PUT**  | `/api/admin/users/:id`        | Foydalanuvchi rolini yoki statusini o'zgartirish   | Admin |
| **POST** | `/api/admin/verify/:barberId` | Sartaroshni verifikatsiyadan o'tkazish             | Admin |

### 7. AI va Real-time (Stream)

| Metod    | Yo'l (Path)         | Tavsif                                        | Roli   |
| -------- | ------------------- | --------------------------------------------- | ------ |
| **POST** | `/api/chat`         | AI yordamchi bilan suhbat                     | All    |
| **GET**  | `/api/stream/queue` | **SSE:** Navbatdagi jonli o'zgarishlar oqimi  | All    |
| **GET**  | `/api/health`       | Server va DB holati                           | Public |

### Texnik Eslatmalar

1. **Validatsiya:** Har bir `POST` va `PUT` so'rovi uchun Zod orqali ma'lumotlar tekshiriladi.
2. **Xavfsizlik:** Barcha API yo'llari (Public'dan tashqari) `Authorization: Bearer <token>` sarlavhasini talab qiladi.
3. **Real-time:** `PATCH /api/bookings/:id` muvaffaqiyatli bo'lganda Socket.io orqali tegishli foydalanuvchiga bildirishnoma yuboriladi.

---

## 9. LLM Integratsiyasi: TrimAgent

TrimAgent — barbershop ekotizimiga moslashtirilgan AI yordamchisi. Foydalanuvchi nomidan bron qilish, tahlil qilish va tavsiya berish kabi amallarni bajaradi.

### Qanday ishlaydi?

Foydalanuvchi chat orqali xabar yuborganda (masalan: *"Bugun soat 14:00 ga Erkin ustaga yozib qo'y"*), backend quyidagilarni bajaradi:

1. **Kontekstni yuklash:** Foydalanuvchining faol bronlari, sartaroshlarning bo'sh vaqtlari va xizmatlar ro'yxati yuklanadi.
2. **Suhbat tarixi:** `chat_messages` jadvalidan oxirgi xabarlar olinadi.
3. **Prompt tuzish:** Tizim promti + Foydalanuvchi konteksti + Suhbat tarixi + Yangi xabar.
4. **LLM chaqiruvi:** OpenRouter orqali model ga so'rov yuboriladi.
5. **Parsing & Execution:** LLM qaytargan JSON tahlil qilinadi va undagi amallar avtomatik ijro etiladi.
6. **Saqlash:** Xabar va bajarilgan ishlar bazaga yozilib, natija frontendga qaytariladi.

### Tizimlashtirilgan Natija Sxemasi (Structured Output)

```json
{
  "message": "Albatta! Erkin ustaga soat 14:00 ga 'Soch kesish' xizmati uchun joy band qildim.",
  "bookings": [
    {
      "barber_id": "erkin_u_001",
      "action": "create",
      "time": "2026-04-30T14:00:00Z",
      "service_name": "Soch kesish"
    }
  ],
  "recommendations": [
    { "style": "Fade", "reason": "Sizning yuz tuzilmangizga mos keladi" }
  ]
}
```

- **message** (majburiy): Foydalanuvchiga ko'rsatiladigan javob matni.
- **bookings** (ixtiyoriy): Bron yaratish, o'zgartirish yoki bekor qilish buyruqlari.
- **recommendations** (ixtiyoriy): Soch uslubi bo'yicha tavsiyalar.

### Avtomatik Ijro (Auto-Execution)

LLM tomonidan ko'rsatilgan amallar tasdiqlashsiz amalga oshiriladi. Agar usta u vaqtda band bo'lsa, tizim xatoni LLM ga qaytaradi va u foydalanuvchiga alternativ taklif qiladi.

### Tizim Promti Ko'rsatmalari

LLM o'zini **"TrimFlow — Sizning shaxsiy uslub yordamchingiz"** deb tanishtiradi:

- **Mijoz uchun:** Bo'sh vaqtlarni topishda yordam beradi va rasmga qarab soch turmagi tavsiya qiladi.
- **Sartarosh uchun:** Kunlik daromadni tahlil qiladi, navbatlarni nazorat qilishda yordam beradi.
- **Xulq-atvor:** Qisqa, do'stona va professional javoblar. Har doim JSON formatiga amal qiladi.

### LLM Mock Rejimi (Testing)

`.env` faylida `LLM_MOCK=true` bo'lganda backend OpenRouter'ga murojaat qilmaydi, balki simulyatsiya qilingan javobni qaytaradi.

### Texnik Stack (LLM)

- **Model:** OpenRouter orqali tezkor inference modeli
- **Integration:** Structured Output (JSON Mode)

---

## 10. Frontend Dizayni

### 1. Bosh Sahifa — Sartaroshlar Katalogi

- Sartaroshlar kartochkalar (cards) ko'rinishida chiroyli joylashtiriladi: rasm, ism, reyting, xizmat turlari.
- Filtr imkoniyati: xizmat turi, narx oralig'i, bo'sh vaqt bo'yicha.

### 2. Sartarosh Sahifasi

- Sartaroshning to'liq profili: rasm, bio, xizmatlar ro'yxati va narxlar.
- **Ish Jadvali:** Haftalik ko'rinish. Har bir kun uchun soatlik slotlar:
  - **Bo'sh slot:** Ko'k (`#209dd7`) — bosish bilan bron oynasi ochiladi.
  - **Band slot:** Kulrang (`#30363d`) — mijoz ismi va xizmat yozilgan.
  - Real-time yangilanish: boshqa foydalanuvchi band qilsa, slot darhol o'zgaradi.

### 3. Sartarosh Dashboard

- **Bugungi Navbatlar Jadvali:** Ustunlar — Mijoz (avatar bilan), Xizmat, Narx, Vaqt, Holat.
- **Holat tugmalari:** "Boshlash" → status "Jarayonda"ga, "Yakunlash" → "Bajarildi"ga o'tadi.
- **Daromad Grafigi:** Haftalik daromad — oddiy chiziqli grafik.
- **Xizmatlar Sozlamasi:** Xizmat qo'shish, tahrirlash, o'chirish (CRUD panel).

### 4. Bandlik Xaritasi (Availability Map)

- Sartaroshxonaning eng band kunlari va soatlarini ko'rsatadi.
- To'q binafsha (`#753991`) — eng ko'p talab bo'ladigan vaqt, och rang — bo'sh vaqtlar.
- Mijoz o'zi uchun eng qulay vaqtni topa oladi.

### 5. Tezkor Bron Paneli (Quick Booking Bar)

- Xizmat tanlash (Dropdown).
- Usta tanlash.
- Sana va vaqt tanlash.
- "Bron qilish" tugmasi (`#753991`) — bir sahifada, ortiqcha qadamlarsiz.

### 6. TrimAgent AI Sidebar

- Chat interfeysi — foydalanuvchi yozadi, AI javob beradi.
- Namuna so'rovlar: *"Menga eng yaqin bo'sh vaqtni top"*, *"Yuz tuzilishimga qarab stil tavsiya qil"*.
- **Auto-Execution:** Chat ichida "Bron yaratildi" degan tasdiq kartochkasi paydo bo'ladi.

### 7. Sarlavha (Global Header)

- **StyleCoins balansi** (agar mavjud bo'lsa, jonli hisoblagich).
- **Server holati:** Ulanish indikatori 🟢 OK.
- **Countdown:** "Sizning vaqtingizga 45 daqiqa qoldi" (Mijoz uchun) yoki "Keyingi mijozga 12 daqiqa qoldi" (Sartarosh uchun).

### 8. Mijoz Profili

- Avatar yuklash, ism tahrirlash.
- **Faol bronlar:** Sartarosh ismi, xizmat, sana va vaqt yaqqol ko'rinib turadi.
- **O'tgan bronlar tarixi:** Avvalgi tashriflar ro'yxati.

---

## 11. UI Stilistikasi

- **Mavzu:** Dark Professional (`#0d1117` fonda).
- **Shriftlar:** Sarlavhalar uchun kuchli display shrifti, ma'lumotlar uchun monospace (Roboto Mono yoki JetBrains Mono) — "professional workstation" hissi.
- **Borderlar:** Nozik `#30363d` chegaralar orqali bloklarga bo'lingan ekran.
- **Animatsiyalar:**
  - Status o'zgarganda satr ~500ms yashil bo'lib miltillaydi.
  - Bron band bo'lganda slot "fade-in" effekti bilan silliq yopiladi.
  - Yangi bildirishnoma kelganda sariq (`#ecad0a`) urg'u bilan paydo bo'ladi.

---

## 12. Testing

### A. Backend Testing

- **Avtorizatsiya va Rollar:** Google OAuth orqali kirganda to'g'ri rol (`client`) berilishini tekshirish. Admin API'lariga sartarosh kira olmasligini tekshirish (403 Forbidden).
- **Bron Qilish Mantiqi:**
  - Ikki xil mijoz parallel so'rov yuborganda bitta slotni band qilib qo'ymasligini tekshirish (Race condition test).
  - Ish vaqtidan (08:00–18:00) tashqaridagi bron qabul qilinmasligini tekshirish.
- **AI Agent:** OpenRouter javobining JSON sxemaga mosligini tekshirish. Chat orqali "Bron yarat" buyrug'i berilganda bazada haqiqatan `Booking` hujjati paydo bo'lishini tekshirish.
- **Real-time:** Bron yaratilganda SSE endpointiga to'g'ri ma'lumot yuborilayotganini tekshirish.

### B. Frontend Testing

- **Jadval UX:** Foydalanuvchi 14:00 slotini bosganda bron oynasida to'g'ri ma'lumot ko'rinishini tekshirish.
- **Real-time Sinxron:** SSE xabari kelganda sahifani yangilamasdan slotning rangi o'zgarishini tekshirish.
- **Animatsiyalar:** Status yangilanganda yashil miltillash vizual (snapshot) test.
- **Rang Muvofiqligi:** Barcha komponentlar `#0d1117` fonda va to'g'ri ranglarda ekanligi.
- **AI Chat:** Xabar yuborilganda loading indikatori, javob kelgandan keyin tasdiq kartochkasi paydo bo'lishi.

### C. E2E (End-to-End) Oqimlar

- **Mijoz yo'li:** Login → Sartarosh tanlash → Bo'sh slotni bron qilish → Profilida bronni ko'rish.
- **Sartarosh yo'li:** Login → Dashboardda yangi mijozni ko'rish → Statusni "Bajarildi"ga o'tkazish → Daromad ko'rsatkichini kuzatish.

### Ishlatiladigan Vositalar

| Qatlam            | Instrument                     | Nega?                                                              |
| ----------------- | ------------------------------ | ------------------------------------------------------------------ |
| **Backend Unit**  | Jest / Supertest               | API endpointlarini tezkor tekshirish uchun.                        |
| **Frontend Unit** | Vitest / React Testing Library | Komponentlar holatini tekshirish uchun.                            |
| **E2E Testing**   | Playwright                     | Haqiqiy brauzerda mijoz va sartarosh rollarini simulyatsiya uchun. |
| **AI Mocking**    | Custom Mock Server             | `LLM_MOCK=true` bo'lganda sun'iy AI javoblarini qaytarish uchun.  |
