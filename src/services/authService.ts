import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from './firebase';

export { isFirebaseConfigured };

function requireAuth() {
  if (!auth) {
    throw new Error('Cloud sync isn’t set up yet. Add your Firebase config to enable sign-in.');
  }
  return auth;
}

/** Subscribes to Firebase auth state; calls back immediately with null if Firebase isn't configured. */
export function subscribeToAuthChanges(callback: (user: User | null) => void): () => void {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

export async function signUpWithEmail(email: string, password: string, displayName?: string): Promise<User> {
  const a = requireAuth();
  const credential = await createUserWithEmailAndPassword(a, email.trim(), password);
  if (displayName) {
    await updateProfile(credential.user, { displayName });
  }
  return credential.user;
}

export async function signInWithEmail(email: string, password: string): Promise<User> {
  const a = requireAuth();
  const credential = await signInWithEmailAndPassword(a, email.trim(), password);
  return credential.user;
}

/** Web-only: Firebase's own popup-based Google sign-in. */
export async function signInWithGooglePopup(): Promise<User> {
  const a = requireAuth();
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(a, provider);
  return result.user;
}

/** Native: exchange a Google ID token (from expo-auth-session) for a Firebase session. */
export async function signInWithGoogleIdToken(idToken: string): Promise<User> {
  const a = requireAuth();
  const credential = GoogleAuthProvider.credential(idToken);
  const result = await signInWithCredential(a, credential);
  return result.user;
}

export async function signOutUser(): Promise<void> {
  if (!auth) return;
  await signOut(auth);
}

/** Maps Firebase auth error codes to short, user-facing messages. */
export function friendlyAuthError(error: unknown): string {
  const code = (error as { code?: string } | null)?.code ?? '';
  switch (code) {
    case 'auth/email-already-in-use':
      return 'That email is already registered. Try signing in instead.';
    case 'auth/invalid-email':
      return 'Enter a valid email address.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again in a bit.';
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'Sign-in was cancelled.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection and try again.';
    default:
      return (error as { message?: string } | null)?.message || 'Something went wrong. Please try again.';
  }
}
