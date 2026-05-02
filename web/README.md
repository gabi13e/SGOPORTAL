# SGO Portal — Web

Public landing site, scholarship application form, and admin dashboard for the **Scholars and Grants Office (SGO)**.

**Stack:** React 18 · Vite · TypeScript · TailwindCSS · shadcn/ui · Firebase (Auth + Firestore + Hosting) · Recharts

> The mobile app for scholar grantees (Flutter) lives in `../mobile/` and shares this same Firebase project.

---

## 1. Install

```powershell
cd E:\SGOPORTAL\web
npm install
```

## 2. Create a Firebase project

1. Go to https://console.firebase.google.com → **Add project**.
2. Once created, **Build → Authentication → Get Started** and enable the **Email/Password** sign-in provider.
3. **Build → Firestore Database → Create database** (start in production mode; we ship rules below).
4. **Project settings (gear icon) → General → Your apps → Web** (`</>` icon). Register the app and copy the config snippet.

## 3. Configure local env

Copy `.env.example` to `.env` and fill in the values from step 2:

```powershell
copy .env.example .env
```

Open `.env` and paste the matching values.

Then edit `.firebaserc` and replace `REPLACE_WITH_YOUR_FIREBASE_PROJECT_ID` with your project ID.

## 4. Seed the admin user

1. In the Firebase console: **Project settings → Service accounts → Generate new private key**. Save it as `serviceAccountKey.json` in this `web/` folder (already gitignored).
2. Run:

```powershell
npm run seed:admin
```

This creates the default admin: **`admin@sgo.local` / `admin123`**. Change the password after first login.

## 5. Run locally

```powershell
npm run dev
```

Open http://localhost:5173.

## 6. Deploy

```powershell
firebase login        # one-time
npm run deploy        # builds + deploys hosting + firestore rules
```

---

## Pages

| Route | Access | Purpose |
|---|---|---|
| `/` | Public | Landing — SGO overview, features, contact |
| `/about` | Public | SGO mission/vision/values (placeholders) |
| `/contact` | Public | Office details |
| `/apply` | Public | Online scholarship application form |
| `/login` | Public | Admin login |
| `/admin` | Admin only | Dashboard — KPIs + recent applications |
| `/admin/applicants` | Admin only | Review applications, approve/reject |
| `/admin/scholars` | Admin only | Active scholars list |
| `/admin/reports` | Admin only | Real-time analytics & charts |

## Data model (Firestore)

- `applications/{id}` — created by the public form. Fields: `fullName, studentId, email, phone, program, yearLevel, gwa, householdIncome, scholarshipType, reason, status, eligibilityCheck, submittedAt`.
- `scholars/{id}` — created automatically when an application is approved.
- `users/{uid}` — reserved for the Flutter mobile app (scholar profiles).

## Editable content

The landing, about, and contact pages contain `[Placeholder]` text. Edit:

- [src/pages/Landing.tsx](src/pages/Landing.tsx) — hero copy & SGO description
- [src/pages/About.tsx](src/pages/About.tsx) — mission/vision/values
- [src/pages/Contact.tsx](src/pages/Contact.tsx) — address, email, phone, socials
