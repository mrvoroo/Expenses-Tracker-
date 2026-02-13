import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? '',
};

let app: ReturnType<typeof initializeApp> | null = null;
let auth: ReturnType<typeof getAuth>;
let db: ReturnType<typeof getFirestore>;

/** true فقط عندما تكون مفاتيح Firebase موجودة (مثلاً من .env أو Netlify Environment variables) */
export const isFirebaseConfigured =
  Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && !firebaseConfig.apiKey.includes('demo'));

try {
  const hasConfig = firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.apiKey !== 'demo';
  if (hasConfig) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true') {
      try {
        connectAuthEmulator(auth, 'http://127.0.0.1:9099');
        connectFirestoreEmulator(db, '127.0.0.1', 8080);
      } catch {
        // ignore
      }
    }
  } else {
    // Dummy app so the app doesn't crash when .env is not set yet
    app = initializeApp({
      apiKey: 'demo',
      authDomain: 'demo',
      projectId: 'demo',
      storageBucket: 'demo',
      messagingSenderId: 'demo',
      appId: 'demo',
    });
    auth = getAuth(app);
    db = getFirestore(app);
  }
} catch {
  // Fallback: use dummy app so UI still loads
  app = initializeApp({
    apiKey: 'demo',
    authDomain: 'demo',
    projectId: 'demo',
    storageBucket: 'demo',
    messagingSenderId: 'demo',
    appId: 'demo',
  });
  auth = getAuth(app);
  db = getFirestore(app);
}

export { auth, db };
export default app;
