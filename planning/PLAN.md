# Loyiha Spetsifikatsiyasi

## 1. Loyiha Viziyasi (Vision)

**TrimFlow (Barber Ally — Sartaroshlik Ittifoqchisi)** — bu sartaroshxonalar faoliyatini to'liq raqamlashtiruvchi, real vaqt rejimidagi navbatlarni boshqaruvchi va o'rnatilgan AI chat-yordamchisiga ega bo'lgan yuqori platforma. U shunchaki bron qilish sayti emas, balki sartaroshlar uchun **"Barbershop Terminali"** bo'lib xizmat qiladi: u daromadlarni tahlil qiladi, mijozlar oqimini bashorat qiladi va har bir mijoz uchun individual uslub tavsiya qila oladi.

---

# 2. UX

## 1. Landing Page (Ommaviy Sahifa) va Avtorizatsiya

- **Public Page (Landing):** Saytga kirish bilan foydalanuvchini vizual jihatdan toza, ortiqcha detallarsiz (Notion uslubidagi minimalist) dizayn kutib oladi. Ekran markazida kuchli "Call to Action" (Masalan: _"O'z uslubingizni kuting emas, bron qiling"_).
- **Avtorizatsiya (Auth):** "Tizimga kirish" va "Ro'yxatdan o'tish" sahifalari silliq CSS animatsiyalari bilan ochiladi.
  - **Advanced UX:** Uzun formalarni to'ldirib o'tirmaslik uchun **Google Login** orqali 1-klikda kirish imkoniyati alohida ajratib ko'rsatiladi.

---

## 2. Foydalanuvchi (Client) Rolining Imkoniyatlari

Foydalanuvchi tizimga muvaffaqiyatli kirgach, uni interaktiv va qulay ekotizim kutib oladi:

- **Sartaroshlar Lentasini Kuzatish:** Asosiy sahifada sartaroshlarning e'lonlari, reytingi va qisqacha portfoliolari chiroyli kartochkalar (cards) ko'rinishida chiqib turadi.
- **Xizmatni Tanlash:** Biror sartaroshni tanlagach, uning shaxsiy sahifasi ochiladi. U yerda xizmatlar ro'yxati (soch qisqartirish, soqol tekislash va h.k.) va narxlar ko'rinadi.
- **Interaktiv Ish Jadvali (Smart Booking):** Xizmat tanlangach, sartaroshning ish jadvali ekranga chiqadi.
  - **UX Yechim:** Vaqtlar 8:00 dan 18:00 gacha bo'lingan **1 soatlik slotlar** ko'rinishida taqdim etiladi.
  - Boshqa mijozlar tomonidan band qilingan vaqtlar nozik kulrang (o'chgan) rangda, bo'sh vaqtlar esa yashil (yoki faol) rangda yonib turadi. Foydalanuvchi bo'sh slotni tanlashi bilan real vaqtda o'zgarish sodir bo'ladi.
- **Mijoz Profili:** Profil bo'limida foydalanuvchi o'z rasmini yuklay oladi, ism-familiyasini tahrirlaydi.
  - **Booking Tarixi:** Eng muhimi, faol bronlar qismi. Bu yerda sartaroshning ismi, xizmat turi, tanlangan sana va vaqt (masalan: _14:00 - 15:00_) yaqqol ko'rinib turadi.
- **Smart Eslatmalar (Reminders):** Mijozning bron qilingan vaqtiga aynan 1 soat qolganda tizim avtomatik ravishda bildirishnoma (eslatma) yuboradi.

---

## 3. Sartarosh (Barber) Rolining Imkoniyatlari

Sartarosh sifatida ro'yxatdan o'tgan yoki tizimga kirgan foydalanuvchi uchun maxsus ish stansiyasi (Dashboard) ochiladi:

- **Sozlamalar va Xizmatlar Qo'shish:** Sartarosh o'ziga taqdim etadigan xizmatlarni (nomi, narxi, davomiyligi) qo'sha oladi. Shuningdek, o'zining standart ish vaqtini (08:00-18:00) belgilaydi.
- **Jonli Navbat Monitori (Booking Dashboard):** Bugungi kun uchun nechta odam yozilgani, ularning ismlari va qaysi soatlarga band qilingani ro'yxat va mini-grafik ko'rinishida turadi. Tizim avtomatik yangilanib, yangi yozilgan mijoz darhol paydo bo'ladi.
- **Moliyaviy Hisobot (Analytics):** Dashboard'ning alohida qismida "P&L" (Foyda/Zarar) treyding ilovalaridagidek aniq ko'rsatiladi.
  - _Metrikalar:_ Bugun qabul qilingan mijozlar soni, jami kunlik/haftalik daromad. O'sish ko'rsatkichlari yashil, pasayishlar qizil rangda nozik animatsiyalar bilan aks etadi.

---

## 4. Administrator (Admin) Rolining Imkoniyatlari

Platformani to'liq nazorat qilish uchun mo'ljallangan yopiq tizim. Admin akkaunti bazaga oldindan (seeder orqali) kiritilgan bo'ladi:

- **Kredensiallar:** Email: `admin@gmail.com` | Parol: `admin123`
- **Global Dashboard:** Sayt yuklanganda barcha tizim statistikasi chiqadi: umumiy foydalanuvchilar soni, faol sartaroshlar soni, kunlik tasdiqlangan bronlar qamrovi.
- **To'liq CRUD Operatsiyalar:** Admin barcha jadvallar (tables) ustidan to'liq nazoratga ega bo'ladi.
  - Mijozlar ro'yxatini ko'rish, tahrirlash, bloklash.
  - Sartaroshlar akkauntlarini tasdiqlash, ro'yxatdan o'chirish.
  - Xizmatlar, to'lovlar va umumiy tizim sozlamalarini boshqarish.

---

## Vizual Kontseptsiya

Loyiha dizayni ma'lumotlarga boy, aniq va dinamik bo'ladi.

### 1. Ranglar sxemasi va Mavzu

- **Fon (Background):** `#0d1117` (Deep Dark) — ko'zni charchatmaydigan, chuqur to'q ko'k-qora fon.
- **Chegaralar (Borders):** `#30363d` — xira kulrang, bloklarni bir-biridan ajratish uchun. Mutlaq qora rangdan qochiladi.
- **Urg'u beruvchi Sariq (Accent Yellow):** `#ecad0a` — logotip, asosiy ikonka va muhim statuslar uchun.
- **Asosiy Ko'k (Blue Primary):** `#209dd7` — navigatsiya va ma'lumotlar grafiklari (charts) uchun.
- **Ikkilamchi Binafsha (Purple Secondary):** `#753991` — "Bron qilish" yoki "Xizmatni yuborish" kabi asosiy harakat tugmalari (Action Buttons) uchun.

---

# 3. Loyiha arxitekturasi

```
trimflow/
├── frontend/                 # Next.js TypeScript (Bloomberg-style UI)
├── backend/                  # Node.js (Business Logic & Real-time)
├── planning/                 # Agentlar uchun "Muvofiqlashtirish Markazi"
│   ├── PLAN.md               # Asosiy yo'l xaritasi (Contract)
│   ├── ARCHITECTURE.md       # Tizim dizayni va ma'lumotlar oqimi
│   └── API_SPEC.md           # Backend va Frontend o'rtasidagi kelishuv
├── test/                     # Playwright E2E testlari & Docker configs
├── db/                       # MongoDB ulanish sxemalari va seederlar
│   └── .gitkeep
├── scripts/                  # Loyihani bir buyruq bilan yurgizish (setup.sh, start.sh)
├── .env                      # Barcha maxfiy kalitlar (MongoDB URI, Google Auth)
└── .gitignore
```

---

## 🏗️ Modullarning Vazifalari va Chegaralari

### 1. **Frontend (Next.js & TypeScript)**

Ushbu qatlam faqat vizualizatsiya va foydalanuvchi tajribasi (UX) uchun javobgar.

- **Mustaqillik:** Backend ichki mantiqini (masalan, MongoDB qanday ishlashini) bilishi shart emas.
- **Aloqa:** Ma'lumotlarni `/api/*` (REST) va real vaqt rejimidagi o'zgarishlarni (navbatlar, narx/koin o'zgarishi) `/api/stream/*` (Websocket/SSE) orqali oladi.
- **Dizayn:** **Terminal estetikasi** (#0d1117 fon, sariq va ko'k urg'ular) aynan shu qatlamda amalga oshiriladi.

### 2. **Backend (Node.js)**

Loyihaning "miyyasi". Barcha hisob-kitoblar va qoidalar shu yerda joylashadi.

- **Agentic Logic:** Agentlar yozgan mantiqiy kodlar, API marshrutlari va Websocket xabarlarini boshqaradi.
- **Data Flow:** MongoDB bilan bevosita muloqot qiladi, ma'lumotlarni validatsiyadan o'tkazadi va klientlarga yuboradi.
- **Auth:** Google OAuth va rollarga asoslangan (Admin, Barber, Client) kirish tizimini boshqaradi.

### 3. **Planning (The Source of Truth)**

Bu papka agentlar uchun **"Konstitutsiya"** vazifasini o'taydi.

- Frontend muhandisi (Agent), Backend muhandisi (Agent) va QA muhandisi (Agent) har qanday o'zgarishni avval `planning/` ichidagi hujjatlar bilan solishtiradi.
- Bu usul agentlar o'rtasida ziddiyatli (conflict) kodlar yozilishini nolga tushiradi.

---

## 🛡️ Asosiy Texnik Qoidalar

- **Real-time First:** Navbatlar va hisobotlar statik emas, balki jonli (live) oqim sifatida backenddan frontendga uzatiladi.
- **State Management:** Frontendda `Redux Toolkit` yoki `Zustand` yordamida koinlar balansi va navbat holati doimiy sinxronizatsiyada bo'ladi.
- **Testing:** `test/` papkasidagi Playwright skriptlari haqiqiy foydalanuvchi kabi brauzerni ochib, Google login va bron qilish jarayonini avtomatik tekshiradi.

### 5. Muhit O'zgaruvchilari (Environment Variables)

```bash
# --- SERVER CONFIGURATION ---
PORT=5000
NODE_ENV=development

# --- DATABASE (MongoDB) ---
# Mahalliy yoki MongoDB Atlas URI
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/trimflow?retryWrites=true&w=majority

# --- AUTHENTICATION (JWT & Google OAuth) ---
# JWT tokenlarni imzolash uchun maxfiy kalit
JWT_SECRET=your_super_secret_jwt_key_here
# Google Cloud Console orqali olingan kalitlar
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# --- AI & LLM (OpenRouter) ---
# Agentik suhbatlar va tahlil uchun
OPENROUTER_API_KEY=your-openrouter-api-key-here

# --- ASSETS MANAGEMENT (Cloudinary) ---
# Mijoz va sartarosh rasmlarini saqlash uchun
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# --- FRONTEND LINKING ---
# Frontend qaysi manzildan kelayotganini backend bilishi uchun (CORS)
FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

### Xavfsizlik va Foydalanish Qoidalari:

1. **`.gitignore` Modifikatsiyasi:** `.env` fayli hech qachon GitHub repozitoriyasiga chiqib ketmasligi shart. Faqat `.env.example` fayli andoza sifatida qoladi.
2. **Cloudinary:** Sartaroshlar o'z ish namunalarini (portfolio) va foydalanuvchilar o'z profillarini yuklaganda, rasmlar to'g'ridan-to'g'ri Cloudinary-ga boradi, bazada esa faqat URL saqlanadi. Bu bazani yuklamasdan, yuqori tezlikda ishlashni ta'minlaydi.
3. **OpenRouter:** Bu kalit yordamida `TrimAgent` (LLM yordamchisi) mijozlarga stil tavsiya qiladi va sartaroshlarga moliya tahlillarini tushuntirib beradi.

---

# 7. Ma'lumotlar Bazasi (Database)

Barcha modullar uchun to'liq **CRUD** imkoniyatiga ega, RESTful standartlari asosida ishlab chiqilgan API yo'llari (endpoints) jadvali. Ushbu yo'llar backend agenti uchun dasturlash qo'llanmasi vazifasini o'taydi.

## 1. Avtorizatsiya va Foydalanuvchi (Auth & Users)

Foydalanuvchilarni boshqarish va Google orqali kirish.

| Metod      | Yo'l (Path)          | Tavsif                                       | Roli   |
| ---------- | -------------------- | -------------------------------------------- | ------ |
| **POST**   | `/api/auth/register` | Yangi foydalanuvchi yaratish                 | Public |
| **POST**   | `/api/auth/login`    | Email/Password orqali kirish                 | Public |
| **GET**    | `/api/auth/google`   | Google OAuth orqali kirish                   | Public |
| **GET**    | `/api/users/me`      | Joriy foydalanuvchi profilini olish          | All    |
| **PUT**    | `/api/users/profile` | Profil ma'lumotlarini tahrirlash (ism, rasm) | All    |
| **DELETE** | `/api/users/me`      | O'z akkauntini o'chirish                     | All    |

## 2. Sartaroshlar va E'lonlar (Barber CRUD)

Sartaroshlik profili va ommaviy ma'lumotlar.

| Metod      | Yo'l (Path)        | Tavsif                                             | Roli             |
| ---------- | ------------------ | -------------------------------------------------- | ---------------- |
| **GET**    | `/api/barbers`     | Barcha tasdiqlangan sartaroshlarni ko'rish         | Public           |
| **GET**    | `/api/barbers/:id` | Bitta sartaroshning to'liq ma'lumotlarini olish    | Public           |
| **POST**   | `/api/barbers`     | Sartaroshlik profilini yaratish (Usta sifatida)    | Client -> Barber |
| **PUT**    | `/api/barbers/me`  | O'z ish vaqti va profili ma'lumotlarini tahrirlash | Barber           |
| **DELETE** | `/api/barbers/:id` | Sartaroshlik profilini o'chirish                   | Admin            |

## 3. Xizmatlar (Services CRUD)

Sartarosh tomonidan ko'rsatiladigan xizmatlar (Soch, soqol va h.k.).

| Metod      | Yo'l (Path)               | Tavsif                                          | Roli   |
| ---------- | ------------------------- | ----------------------------------------------- | ------ |
| **GET**    | `/api/services/:barberId` | Muayyan sartaroshning barcha xizmatlarini olish | All    |
| **POST**   | `/api/services`           | Yangi xizmat turini qo'shish                    | Barber |
| **PUT**    | `/api/services/:id`       | Xizmat narxi yoki nomini tahrirlash             | Barber |
| **DELETE** | `/api/services/:id`       | Xizmatni o'chirib tashlash                      | Barber |

## 4. Bron qilish tizimi (Bookings CRUD)

Loyiha markazidagi "Trading" oqimi (Real-time).

| Metod      | Yo'l (Path)         | Tavsif                                                   | Roli            |
| ---------- | ------------------- | -------------------------------------------------------- | --------------- |
| **GET**    | `/api/bookings`     | Barcha bronlarni ko'rish (Filtrlar bilan)                | Admin           |
| **GET**    | `/api/bookings/my`  | O'zining bronlar ro'yxatini olish                        | Client / Barber |
| **POST**   | `/api/bookings`     | Yangi vaqtni bron qilish (Market Order)                  | Client          |
| **PATCH**  | `/api/bookings/:id` | Bron holatini o'zgartirish (Status: Completed/Cancelled) | Barber / Client |
| **DELETE** | `/api/bookings/:id` | Bronni tizimdan butunlay o'chirish                       | Admin           |

## 5. Moliya va Analitika (Finance CRUD)

P&L (Profit/Loss) va xarajatlar jurnali.

| Metod      | Yo'l (Path)                | Tavsif                                               | Roli   |
| ---------- | -------------------------- | ---------------------------------------------------- | ------ |
| **GET**    | `/api/finance/stats`       | Umumiy daromad va xarajat statistikasi               | Barber |
| **POST**   | `/api/finance/expense`     | Qo'lda xarajat kiritish (masalan: asbob sotib olish) | Barber |
| **PUT**    | `/api/finance/expense/:id` | Xarajat yozuvini tahrirlash                          | Barber |
| **DELETE** | `/api/finance/expense/:id` | Xarajat yozuvini o'chirish                           | Barber |

## 6. Admin Boshqaruv Paneli (Admin "God Mode")

Barcha ma'lumotlar ustidan mutlaq nazorat.

| Metod    | Yo'l (Path)                   | Tavsif                                             | Roli  |
| -------- | ----------------------------- | -------------------------------------------------- | ----- |
| **GET**  | `/api/admin/dashboard`        | Global statistika (Users, Revenue, Bookings count) | Admin |
| **GET**  | `/api/admin/users`            | Tizimdagi barcha foydalanuvchilar ro'yxati         | Admin |
| **PUT**  | `/api/admin/users/:id`        | Foydalanuvchi rolini yoki statusini o'zgartirish   | Admin |
| **POST** | `/api/admin/verify/:barberId` | Sartaroshni verifikatsiyadan o'tkazish             | Admin |

## 7. AI Copilot & Real-time (Stream)

Dinamik funksiyalar.

| Metod    | Yo'l (Path)         | Tavsif                                           | Roli   |
| -------- | ------------------- | ------------------------------------------------ | ------ |
| **POST** | `/api/chat`         | AI Agent bilan muloqot (Loyiha viziyasidagi LLM) | All    |
| **GET**  | `/api/stream/queue` | **SSE:** Navbatdagi jonli o'zgarishlar oqimi     | All    |
| **GET**  | `/api/health`       | Server va DB holati (Ping)                       | Public |

### 📝 Texnik Eslatmalar:

1. **Validatsiya:** Har bir `POST` va `PUT` so'rovi uchun Joi yoki Zod orqali ma'lumotlar sxemasi tekshiriladi.
2. **Xavfsizlik:** Barcha API yo'llari (Public'dan tashqari) `Authorization: Bearer <token>` sarlavhasini talab qiladi.
3. **Real-time:** `PATCH /api/bookings/:id` so'rovi muvaffaqiyatli bo'lganda, `Socket.io` serveri orqali tegishli foydalanuvchiga bildirishnoma va "yashil yonish" animatsiyasi signali yuboriladi.

---

# 8. LLM uchun ai assitent uchun tz

Bu loyihaning "Agentic AI" qismi, ya'ni **TrimAgent** (LLM yordamchisi) mantiqini barbershop ekotizimiga moslashtirilgan ko'rinishi. Bu yerda LLM shunchaki suhbatlashmaydi, balki foydalanuvchi nomidan amallarni (bron qilish, tahlil qilish) bajaradi.

---

### 🤖 LLM Integratsiyasi: TrimAgent

LLM qo'ng'iroqlari **LiteLLM** orqali **OpenRouter** platformasidagi `gpt-oss-120b` (Cerebras inferens) modeliga yo'naltiriladi. Bu juda yuqori tezlikni ta'minlaydi, shuning uchun "loading" indikatori foydalanuvchi tajribasi uchun yetarli.

### 1. U qanday ishlaydi?

Foydalanuvchi chat orqali xabar yuborganda (masalan: "Bugun soat 14:00 ga Erkin ustaga yozib qo'y"), backend quyidagilarni bajaradi:

1. **Kontekstni yuklash:** Foydalanuvchining joriy holati (StyleCoin balansi, faol bronlari), sartaroshlarning bo'sh vaqtlari va xizmatlar narxi yuklanadi.
2. **Suhbat tarixi:** `chat_messages` jadvalidan oxirgi xabarlar olinadi.
3. **Prompt tuzish:** Tizim promti + Foydalanuvchi konteksti + Suhbat tarixi + Yangi xabar.
4. **Cerebras Call:** `cerebras-inference` ko'nikmasi bilan LiteLLM orqali LLM ga so'rov yuboriladi.
5. **Parsing & Execution:** LLM qaytargan tizimlashtirilgan JSON tahlil qilinadi va undagi harakatlar (masalan, bron yaratish) avtomatik ijro etiladi.
6. **Saqlash:** Xabar va bajarilgan ishlar bazaga yozilib, natija frontendga qaytariladi.

---

### 2. Tizimlashtirilgan Natija Sxemasi (Structured Output)

LLM quyidagi qat'iy JSON formatida javob berishi talab qilinadi:

```json
{
  "message": "Albatta! Erkin ustaga soat 14:00 ga 'Soch kesish' xizmati uchun joy band qildim. 10 StyleCoin keshbek beriladi.",
  "bookings": [
    {
      "barber_id": "erkin_u_001",
      "action": "create",
      "time": "2026-04-30T14:00:00Z",
      "service_name": "Soch kesish"
    }
  ],
  "coin_transactions": [
    { "amount": 10, "type": "earn", "reason": "Booking reward" }
  ],
  "recommendations": [
    { "style": "Fade", "reason": "Sizning yuz tuzilmangizga mos keladi" }
  ]
}
```

- **message** (majburiy): Foydalanuvchiga ko'rsatiladigan javob matni.
- **bookings** (ixtiyoriy): Avtomatik bron qilish, o'zgartirish yoki bekor qilish buyruqlari.
- **coin_transactions** (ixtiyoriy): Koinlarni berish yoki yechib olish.
- **recommendations** (ixtiyoriy): Stil bo'yicha tavsiyalar.

---

### 3. Avtomatik Ijro (Auto-Execution)

LLM tomonidan ko'rsatilgan amallar (bron yaratish yoki bekor qilish) **tasdiqlashsiz** amalga oshiriladi. Bu loyihaning "Agentik" tabiatini ko'rsatish uchun mo'ljallangan.

- Agar usta u vaqtda band bo'lsa yoki koinlar yetishmasa, tizim xatoni LLM ga qaytaradi va u foydalanuvchiga boshqa yechim taklif qiladi (masalan: "U vaqt band ekan, 15:00 ma'qulmi?").

---

### 4. Tizim Promti (System Prompt) Ko'rsatmalari

LLM o'zini **"TrimFlow — Sizning shaxsiy uslub yordamchingiz"** deb tanishtiradi:

- **Klient uchun:** Bo'sh vaqtlarni topishda yordam beradi, koinlarni hisoblaydi va rasmga qarab soch turmagi tavsiya qiladi.
- **Sartarosh uchun:** Kunlik daromadni tahlil qiladi ("Bugun 1.2 mln so'm daromad qildingiz, bu kechagidan 15% ko'p"), navbatlarni optimallashtiradi.
- **Xulq-atvor:** Qisqa, do'stona va professional javoblar. Har doim JSON formatiga amal qilish.

---

### 5. LLM Mock Rejimi (Testing)

Dasturlash va test jarayonini osonlashtirish uchun `.env` faylida `LLM_MOCK=true` sozlamasi mavjud.

- **Mock Active:** Backend OpenRouter'ga murojaat qilmaydi, balki darhol simulyatsiya qilingan javobni qaytaradi (masalan: "OK, yozib qo'ydim").
- **Nega kerak?** API kalitidan tejamkor foydalanish, internet uzilgan holatda ham ishlash va CI/CD testlarini tezroq o'tkazish uchun.

---

### Texnik Stack (LLM qismi):

- **Inference:** Cerebras (Ultra-fast)
- **Model:** `gpt-oss-120b` (yoki muqobil OpenRouter modeli)
- **Framework:** LiteLLM (Python/Nodejs wrapper)
- **Integration:** Structured Output (JSON Mode)

---

# 9. Frontend Dizayni (TrimFlow Workstation)

### 1. Sartaroshlar Paneli (Staff Panel)

- **Vaqtli Statuslar:** Sartaroshlar ro'yxati jadval ko'rinishida. Har bir usta yonida uning joriy holati: 🟢 **"Bo'sh"**, 🟡 **"Mijoz bilan"** (tugashiga 15 daqiqa), 🔴 **"Tushlikda"**.
- **Dinamika:** Status o'zgarganda (masalan, usta bo'shaganda), satr **~500ms** davomida yashil bo'lib miltillaydi.
- **Mini-Grafik:** Har bir usta yonida kunlik yuklama darajasi (oxirgi 5 soatlik bandlik grafigi).

### 2. Master Jadval (Master Schedule Grid)

- **Slotlar holati:**
  - **Bo'sh slot:** `#209dd7` (Ko'k) kontur bilan — ustiga bossa tezkor bron ochiladi.
  - **Band slot:** `#30363d` (To'q kulrang) — ichida mijoz ismi va xizmat turi yozilgan.
  - **Real-time:** Agar boshqa klient joy band qilsa, slot "Live" tarzda yopiladi.

### 3. Bandlik Analitikasi (Capacity Map)

- **Mantiq:** Sartaroshxonaning eng band kunlari va soatlarini ko'rsatadi. To'q binafsha (`#753991`) — eng ko'p odam keladigan vaqt, och sariq — bo'sh vaqtlar.
- **Foyda:** Mijoz o'zi uchun eng tinch vaqtni topishi uchun vizual yordam.

### 4. Navbatlar va Xizmatlar Jadvali (Live Queue Table)

- **Ustunlar:** Mijoz (avatar bilan), Tanlangan xizmat, Narxi, Bron vaqti, StyleCoin keshbeki, Status (Kutilmoqda / Keldi / Bajarildi).
- **Harakatlar:** Sartarosh mijoz kelganda "Start" tugmasini bossa, status real-time yangilanadi.

### 5. Xizmat Band qilish Paneli (Quick Booking Bar)

- **Elementlar:**
  - Xizmat tanlash (Dropdown: "Soch kesish", "Soqol orayish", "Kompleks").
  - Usta tanlash.
  - "Tasdiqlash" tugmasi (`#753991`).
- **Tezkorlik:** Hech qanday ortiqcha sahifalarsiz, bitta klik bilan navbatga yozilish.

### 6. TrimAgent AI Sidebar (Aqlli Yordamchi)

- **Funksiyalar:**
  - "Menga eng yaqin bo'sh vaqtni top" — AI darhol jadvaldan joy topadi.
  - "Yuz tuzilishimga qarab stil tavsiya qil" — AI tavsiya beradi va mos xizmatni bron qilishni taklif qiladi.
  - **Auto-Execution:** Chat ichida "Bron yaratildi" degan tasdiq kartochkasi paydo bo'ladi.

### 7. Sarlavha (Global Header)

- **Moliya:** Jami to'plangan **StyleCoins** balansi (jonli hisoblagich).
- **Status:** Serverga ulanish holati (Connection: OK 🟢).
- **Countdown:** "Keyingi mijozga 12 daqiqa qoldi" (Sartarosh uchun) yoki "Sizning vaqtingizga 45 daqiqa qoldi" (Mijoz uchun).

---

### 🎨 Ranglar va UI Stilistikasi

- **Mavzu:** Dark Professional (#0d1117 fonda).
- **Shriftlar:** Ma'lumotlar uchun Monospace (Roboto Mono) shrifti, bu "Workstation" hissini beradi.
- **Borderlar:** Nozik `#30363d` chegaralar orqali bloklarga bo'lingan ekran.
- **Animatsiyalar:** Har bir status o'zgarishi (bo'sh slot band bo'lishi) "Fade-in" effekti bilan silliq amalga oshadi.

Bu UI dizayni sartaroshga o'z ishini xuddi "dispetcher" kabi aniq nazorat qilish imkonini beradi, mijozga esa zamonaviy va qulay texnologik muhitni taqdim etadi.

---

# 10. Testing

## 🛠 1. Backend Testing Plan (The Engine)

Backend testlari asosan ma'lumotlar yaxlitligi va real-vaqt mantiqiga qaratiladi.

### A. Avtorizatsiya va Rollar (Auth & RBAC)

- **Google OAuth:** Google orqali kirganda foydalanuvchi bazada yaratilishi va to'g'ri rol (`client`) berilishini tekshirish.
- **Access Control:** Admin API'lariga sartarosh yoki mijoz kira olmasligini tekshirish (403 Forbidden).

### B. Bron qilish mantiqi (The Core Logic)

- **Double Booking Prevention:** Ikki xil mijoz bir vaqtda (parallel so'rov yuborganda) bitta slotni band qilib qo'ymasligini tekshirish (Race condition test).
- **Slot Validation:** Sartaroshning ish vaqtidan (08:00 - 18:00) tashqaridagi vaqtlarga bron qabul qilinmasligini tekshirish.

### C. AI Agent & Structured Output

- **JSON Integrity:** OpenRouter'dan kelayotgan javob bizning `Structured Output` sxemamizga (message, bookings, coins) 100% mosligini tekshirish.
- **Auto-Execution:** AI chat orqali "Bron yarat" buyrug'i berilganda, bazada haqiqatdan ham `Booking` hujjati paydo bo'lishini tekshirish.

### D. Real-time Oqim (SSE/Websocket)

- **Event Emission:** Bron yaratilganda server `stream/queue` endpointiga to'g'ri ma'lumot yuborayotganini tekshirish.

---

## 🎨 2. Frontend Testing Plan (The Interface)

Frontend testlari "Terminal" ko'rinishidagi UI'ning dinamikasini va foydalanuvchi tajribasini (UX) tekshiradi.

### A. Interaktiv Jadval (Scheduler UX)

- **Slot Selection:** Foydalanuvchi 14:00 slotini bosganda, tanlangan xizmat bilan birga "Tezkor amallar paneli"da to'g'ri ma'lumot aks etishini tekshirish.
- **State Sync:** Serverdan "Slot band qilindi" degan SSE xabari kelganda, sahifani yangilamasdan slotning rangi qizilga aylanishini tekshirish.

### B. Vizual Effektlar (The "Aha" Moments)

- **Flash Animations:** Ma'lumot yangilanganda (masalan, koinlar qo'shilganda) o'sha hudud yashil bo'lib yonishini vizual (snapshot) test qilish.
- **Theme Consistency:** Barcha komponentlar `#0d1117` fonida va to'g'ri ranglarda (`#ecad0a`, `#209dd7`) ekanligini tekshirish.

### C. AI Chat Experience

- **Loading States:** Chat xabari yuborilganda Cerebras javobini kutish jarayonida "Loading" indikatori chiqishini tekshirish.
- **Action Badges:** AI javob bergandan so'ng, chat ichida "Bron yaratildi" degan interaktiv kartochka paydo bo'lishini tekshirish.

### D. E2E (End-to-End) Flow

- **Mijoz yo'li:** Login -> Sartarosh tanlash -> 1 soatlik slotni bron qilish -> Profilida bronni ko'rish.
- **Sartarosh yo'li:** Login -> Dashboardda yangi kelgan mijozni ko'rish -> Statusni "Bajarildi"ga o'tkazish -> Daromad grafigi o'sishini kuzatish.

---

## 🧪 Ishlatiladigan vositalar (Tools)

| Qatlam            | Instrument                     | Nega?                                                                         |
| ----------------- | ------------------------------ | ----------------------------------------------------------------------------- |
| **Backend Unit**  | Jest / Supertest               | API endpointlarini tezkor tekshirish uchun.                                   |
| **Frontend Unit** | Vitest / React Testing Library | Komponentlar holatini (state) tekshirish uchun.                               |
| **E2E Testing**   | Playwright                     | Haqiqiy brauzerda "Mijoz" va "Sartarosh" rollarini simulyatsiya qilish uchun. |
| **AI Mocking**    | Custom Mock Server             | `LLM_MOCK=true` bo'lganda sun'iy AI javoblarini qaytarish uchun.              |
