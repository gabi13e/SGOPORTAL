// Seeds the default admin user into Firebase Auth.
// Usage:
//   1. Download a service account JSON from Firebase Console → Project Settings → Service Accounts.
//   2. Save as `serviceAccountKey.json` in this `web/` folder (it's gitignored).
//   3. Run: npm run seed:admin
import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { existsSync, readFileSync } from "node:fs";

const ADMIN_EMAIL = "admin@sgo.local";
const ADMIN_PASSWORD = "admin123";

const candidates = ["./serviceAccount.json", "./serviceAccountKey.json"];
const path = candidates.find(existsSync);
if (!path) {
  console.error(`Service account key not found. Looked for: ${candidates.join(", ")}`);
  process.exit(1);
}
const key = JSON.parse(readFileSync(path, "utf8"));
initializeApp({ credential: cert(key) });
const auth = getAuth();

try {
  const existing = await auth.getUserByEmail(ADMIN_EMAIL).catch(() => null);
  if (existing) {
    await auth.updateUser(existing.uid, { password: ADMIN_PASSWORD });
    await auth.setCustomUserClaims(existing.uid, { admin: true });
    console.log(`Admin already existed (${ADMIN_EMAIL}); password reset and admin claim set.`);
  } else {
    const u = await auth.createUser({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD, displayName: "SGO Admin" });
    await auth.setCustomUserClaims(u.uid, { admin: true });
    console.log(`Created admin user ${ADMIN_EMAIL} (password: ${ADMIN_PASSWORD}).`);
  }
} catch (e) {
  console.error("Seed failed:", e);
  process.exit(1);
}
