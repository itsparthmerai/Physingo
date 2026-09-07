import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, type Auth } from 'firebase/auth';
// @firebase/auth's package.json lists a top-level "types" condition ahead of "react-native",
// so TS always resolves the non-RN type declarations here even though Metro correctly resolves
// the "react-native" JS entry at runtime (this project's tsconfig sets customConditions:
// ["react-native"]). getReactNativePersistence genuinely exists at runtime; only the type is missing.
// @ts-expect-error - see comment above; upstream packaging quirk in @firebase/auth's exports map.
import { getReactNativePersistence } from '@firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

/** True once real Firebase config has been provided via EXPO_PUBLIC_FIREBASE_* env vars. */
export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

let auth: Auth | null = null;
let db: Firestore | null = null;

if (isFirebaseConfigured) {
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

  if (Platform.OS === 'web') {
    auth = getAuth(app);
  } else {
    try {
      auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
    } catch {
      // initializeAuth throws if already called once (e.g. Fast Refresh) - fall back to the existing instance.
      auth = getAuth(app);
    }
  }

  db = getFirestore(app);
}

export { auth, db };
