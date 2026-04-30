# Code Review - TrimFlow

## Fix Status

This review has been addressed in the current code changes. The findings below are kept as the original review trail; the implemented fixes cover auth escalation, auth response mismatch, seed password hashing, booking authorization, LLM mutation safety, realtime/SSE scoping, frontend API wiring, tooling gates, and repository structure.

## Findings

### P0 - Public registration lets anyone become admin

`backend/src/controllers/auth.controller.js:11-16`, `backend/src/controllers/auth.controller.js:43`

Public `POST /api/auth/register` accepts `role` from the request body and allows `admin`, `barber`, and `client`. An attacker can register with `{ "role": "admin" }`, receive a valid JWT, and access every admin route protected only by `authorize('admin')`.

Fix: public registration should ignore `role` and always create `client`. Role changes and barber approval should happen only through authenticated admin flows.

### P0 - Login/register frontend contract is broken

`backend/src/controllers/auth.controller.js:47-57`, `backend/src/controllers/auth.controller.js:105-115`, `frontend/src/store/useAuthStore.ts:27-32`, `frontend/src/store/useAuthStore.ts:49-54`

Backend returns `data` as a flat object: `_id`, `name`, `email`, `role`, `token`, etc. Frontend expects `response.data.data.user` and `response.data.data.token`. As a result, `user` and `token` become `undefined`, and `localStorage` can store an invalid token value. Login/register may redirect, but authenticated API calls will fail.

Fix: either return `{ data: { user: {...}, token } }` from backend or parse the current flat response in the frontend. Also normalize `_id` vs `id` across API/types.

### P0 - Seeded credentials do not work

`backend/src/db/seed.js:32-40`, `backend/src/models/User.js:43-47`

The seed script hashes passwords before `User.create`, then the `User` pre-save hook hashes those hashes again. Documented credentials like `admin@gmail.com / admin123` will not match during login.

Fix: pass plain seed passwords into `User.create` and let the model hook hash them once, or explicitly bypass the hook for pre-hashed imports.

### P1 - Booking status changes and deletion have broken authorization

`backend/src/routes/booking.routes.js:18-22`, `backend/src/controllers/booking.controller.js:124-156`, `backend/src/controllers/booking.controller.js:178-189`

Any authenticated owner client can call `PATCH /api/bookings/:id` with `status: "completed"` and award themselves StyleCoins. The route has no role-level transition policy. Also, `deleteBooking` checks client ownership only; for `barber` users there is no barber ownership check, so any barber can delete any booking by ID.

Fix: define allowed status transitions by role. Clients should usually only cancel their own pending/confirmed bookings. Barbers should only update bookings for their barber profile. Admins can override.

### P1 - LLM output is trusted for money and booking mutations

`backend/src/controllers/chat.controller.js:167-210`

The chat endpoint automatically creates bookings and processes `coin_transactions` from the LLM response. It increments `styleCoins` for `ct.userId` from model output, not the authenticated user. Prompt injection or malformed model output can mutate arbitrary users or create bookings without explicit confirmation.

Fix: treat LLM output as suggestions only. Server code must force `userId = req.user._id`, validate service/barber ownership, validate future working-hour slots, and require explicit user confirmation before writes.

### P1 - Double booking protection has a race condition

`backend/src/controllers/booking.controller.js:82-104`, `backend/src/controllers/chat.controller.js:179-193`

The overlap check runs before `Booking.create`. Two concurrent requests for the same barber/time can both pass the check and both insert. The same pattern exists in AI auto-booking.

Fix: enforce slot uniqueness at the database/design level. If bookings are slot-based, add a unique key such as `barberId + startTime` for active slots. If true range overlap is needed, use a transactional locking strategy or a dedicated slot collection.

### P1 - Realtime and SSE leak booking data too broadly

`backend/src/server.js:72-80`, `backend/src/controllers/booking.controller.js:111-115`, `backend/src/controllers/booking.controller.js:165-169`, `backend/src/controllers/stream.controller.js:17-27`

Socket clients can join arbitrary `barber:{id}` and `client:{id}` rooms without authentication, while booking events are currently emitted globally with `io.emit`. The SSE queue endpoint returns all today's active bookings to any authenticated user, including client names/avatars.

Fix: authenticate socket handshakes, authorize room joins, emit only to relevant rooms, and filter SSE responses by role: client sees own bookings, barber sees own barber profile, admin sees all.

### P2 - Frontend is mostly mock UI, not wired to the backend

`frontend/src/app/dashboard/barbers/page.tsx:10-164`, `frontend/src/app/dashboard/booking/[barberId]/page.tsx:11-115`, `frontend/src/app/dashboard/barber/page.tsx:18-127`, `frontend/src/app/dashboard/admin/page.tsx:28-91`, `frontend/src/app/dashboard/profile/page.tsx:10-139`, `frontend/src/store/useChatStore.ts:4-80`

Core pages use hard-coded mock data and simulated delays. Booking confirmation does not call `POST /api/bookings`, admin actions do not call admin endpoints, profile edit does not call `/users/profile`, and chat does not call `/api/chat`.

Fix: replace mocks with API-backed stores/hooks and make empty/loading/error states reflect actual backend responses.

### P2 - Booking frontend endpoint and data shape do not match backend

`frontend/src/store/useBookingStore.ts:61-68`, `backend/src/routes/booking.routes.js:18-22`, `frontend/src/types/index.ts:43-58`

Frontend cancellation calls `PATCH /bookings/${id}/cancel`, but backend only defines `PATCH /bookings/:id` and expects `{ status: "cancelled" }`. The frontend also expects flat fields like `id`, `clientName`, `barberName`, and `serviceName`, while backend returns Mongo `_id` plus populated `clientId`, `barberId`, and `serviceId`.

Fix: add a response mapper on the frontend or change backend DTOs to stable API shapes. Align cancel endpoint semantics.

### P2 - Admin expense creation is inconsistent with Joi validation

`backend/src/controllers/finance.controller.js:8-12`, `backend/src/controllers/finance.controller.js:101-115`

Admin expense creation requires `req.body.barberId`, but `expenseSchema` does not allow/declare `barberId`. This makes the admin flow invalid or fragile depending on Joi unknown-key behavior.

Fix: include `barberId` in the create schema, verify the barber exists, and use a separate update schema if updates should not move expenses across barbers.

### P2 - Booking input validation misses core business rules

`backend/src/controllers/booking.controller.js:68-80`

Booking creation checks that the service belongs to the submitted barber, but it does not check whether the barber exists, is verified, is working at that time, or whether `startTime` is in the future. Past and out-of-hours bookings can be created directly through the API.

Fix: validate barber existence/status, working hours, future time, and slot granularity before creating a booking.

### P2 - Repository structure is not reproducible

`.gitignore:10-13`

Root git tracks `backend/node_modules` despite `.gitignore`; `git ls-files backend/node_modules | wc -l` reports `3019` tracked files. Root git also stores `frontend` as a gitlink (`160000`) but there is no `.gitmodules`, so a fresh clone will not know where to fetch the frontend from.

Fix: remove tracked dependency folders from git, keep lockfiles, and either make `frontend` a normal tracked directory or add a valid `.gitmodules` entry.

### P3 - Tooling quality gates are not green

`frontend/src/components/ai/TrimAgentChat.tsx:42`, `frontend/src/components/layout/Header.tsx:13`

`npm run lint` in `frontend` fails with 36 errors and 5 warnings. Most errors are `react/no-unescaped-entities`, plus React hook lint errors for synchronous `setMounted(true)` effects. Backend `npm test` intentionally fails because no tests are configured.

Fix: clean lint errors, decide whether those React 19 lint rules are desired, and add at least focused backend tests for auth, booking authorization, and seed login.

## Verification

- `frontend`: `npm run lint` failed with 36 errors and 5 warnings.
- `frontend`: `npm run build` passed after rerunning outside the sandbox restriction. It still warns that Next inferred the workspace root from `/Users/asilbekbekmurodov/package-lock.json`.
- `backend`: `find backend/src -name '*.js' -print0 | xargs -0 -n1 node -c` passed.
- `backend`: `npm test` failed because the script is `echo "Error: no test specified" && exit 1`.

## Short Summary

The highest-risk issues are auth privilege escalation, broken auth response parsing, unusable seeded credentials, and booking/LLM mutations that trust the caller or model too much. Before adding features, fix auth contracts and role policies, wire the frontend to real APIs, and add regression tests around the booking and admin flows.
