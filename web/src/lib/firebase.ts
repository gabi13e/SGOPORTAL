import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import { getAnalytics, isSupported as analyticsSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Use auto-detected long-polling to work around the firebase-js-sdk WebChannel
// "INTERNAL ASSERTION FAILED (ID: b815)" bug that triggers behind some
// networks/proxies/extensions.
export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
});

analyticsSupported().then((ok) => {
  if (ok && firebaseConfig.measurementId) getAnalytics(app);
}).catch(() => {});
