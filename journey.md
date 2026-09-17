# Journey - Task Manager

## Project Status: In Progress

---

### Log

- **2026-09-13** — Repo created. Empty project. Starting task manager build.
- **2026-09-13** — Task 1: Initialized monorepo. Created root `package.json`, `.gitignore`, `.env.example`. Added `/client` and `/server` dirs.
- **2026-09-13** — Task 2: Set up Vite + React app. Created `App.jsx`, `AuthContext`, `ProtectedRoute`, pages: `Login`, `Signup`, `Calendar`, `Settings`. Added `TaskModal` component. CSS with base styles.
- **2026-09-13** — Task 3: Set up Express server. Created routes (`auth`, `tasks`, `settings`), middleware (`auth`), db connection (`knex`), migrations for `users`, `tasks`, `settings` tables.
- **2026-09-13** — Task 4: Added notification services (Twilio SMS, Nodemailer email), reminder cron job. Added calendar + modal CSS.
- **2026-09-13** — Task 5: Installed PostgreSQL, created DB, ran migrations. Changed port to 5001 (5000 occupied by macOS). Both servers running.
- **2026-09-13** — Task 6: Added sidebar with +ADD button for quick task creation.
- **2026-09-13** — Task 7: Made end_time optional for tasks/reminders. Added migration.
- **2026-09-13** — Task 8: Removed task type (task/event/reminder) from modal and DB.
- **2026-09-13** — Task 9: Prepared for deployment. Added CORS config, API abstraction layer, Vercel config.
- **2026-09-16** — Task 10: Fixed task create. Dropped `tasks_reminder_check` so `0m` works. Reverted raw insert to knex.
- **2026-09-16** — Task 11: Added forgot password. `password_resets` table, `/forgot-password` sends code via email/SMS, `/reset-password` resets. New `ForgotPassword` page + login link.
- **2026-09-16** — Task 12: Swapped Nodemailer for Resend API. Updated email service + env vars.
- **2026-09-16** — Task 13: Forgot password 3-step flow: send code → verify code → reset password. Removed dev code display. Added confirm password.
- **2026-09-16** — Task 14: India (+91) phone input. Strip +91 if entered, store 10-digit only. PhoneInput component with +91 prefix. Updated Signup + ForgotPassword.
- **2026-09-16** — Task 15: Swapped Twilio for Fast2SMS (free for India). Updated SMS service, .env, .env.example.
- **2026-09-16** — Task 16: Removed all SMS/phone functionality. Email-only for auth and reminders. Dropped phone column from users, reminder_sms from settings. Deleted sms.js, PhoneInput.jsx.
- **2026-09-17** — Task 17: Full UI redesign. Dark glassmorphism theme (#0d0f14 bg, #7c6aff accent). Inter font. Animated blob auth pages (Login, Signup, ForgotPassword). Glassmorphism sidebar, gradient task chips, dark calendar grid, slide-up modal, step-dot indicator for forgot-password flow, toggle switch settings, btn-danger for delete. Full index.css rewrite + index.html updated with font + SEO meta.
- **2026-09-17** — Task 18: LAN access. Server listens on 0.0.0.0, CORS origin true. Vite host 0.0.0.0. People on same WiFi can access app.
- **2026-09-17** — Task 19: Delete account with email verification. request-delete + confirm-delete endpoints. Danger zone section in Settings. 3-step flow: click delete → send code → enter code → account deleted.
- **2026-09-17** — Task 20: Wiped all user data. Created migration 012 to delete all rows from users, tasks, settings, password_resets tables. All accounts removed.
- **2026-09-17** — Task 21: Email verification on signup. Added `email_verified` column (default false) to users. Signup creates user + sends 6-digit code. New `/verify-signup` endpoint verifies code, marks verified, returns token. Login rejects unverified users. Signup page now 2-step: enter details → enter code.
- **2026-09-17** — Task 22: Interactive landing page. Created `Landing.jsx` with navbar (logo + nav links + Login/Sign Up buttons top right), hero section with animated blobs, gradient title, CTA buttons, fake app preview window, features grid (6 cards with hover highlight), stats section, CTA section, footer. Dark glassmorphism theme consistent. Updated `App.jsx` — `/` route → Landing, wildcard redirects to `/`. Added ~250 lines CSS to index.css. Fixed unescaped quote in feature description.
- **2026-09-17** — Task 23: Added back button (← Back) to Login and Signup pages linking to landing page `/`. Added `.auth-back` CSS.
- **2026-09-17** — Task 24: Removed Quick Add and Dark Mode feature cards from landing page. Updated features grid to 2 columns.
- **2026-09-17** — Task 25: Skip landing page if logged in. Added `useAuth` check in Landing.jsx — redirects to `/calendar` if user exists.
- **2026-09-17** — Task 26: Fixed signup "Signup failed" error. Root cause: stale server process running old code with `phone` column reference. Restarted server. Also restructured signup to 3-step email-first flow: (1) enter name+email → send code, (2) verify code → email confirmed, (3) set password → account created. New `/set-password` endpoint with temp JWT token (15min expiry). Migration 014 made `password_hash` nullable. Updated AuthContext with `setPassword`. Login guards against null password_hash. Added confirm password field on step 3.
