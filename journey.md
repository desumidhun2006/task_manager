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

