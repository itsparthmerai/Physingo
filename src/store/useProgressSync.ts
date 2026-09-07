import { useEffect, useRef } from 'react';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../services/firebase';
import { useAuthStore } from './useAuthStore';
import { getSyncableProgress, useProgressStore, type SyncableProgress } from './useProgressStore';

const SYNC_DEBOUNCE_MS = 1500;

function progressDocRef(uid: string) {
  // db is guaranteed non-null by the isFirebaseConfigured check at every call site.
  return doc(db!, 'users', uid);
}

function isSyncableProgress(data: unknown): data is SyncableProgress {
  return Boolean(data) && typeof data === 'object' && 'lessonProgress' in (data as object);
}

/**
 * Mount once near the app root. Whenever a user is signed in, this:
 * 1. On first sign-in on a device, pulls their saved cloud progress down (or, if this is
 *    their very first sign-in anywhere, pushes current local/guest progress up instead).
 * 2. Keeps pushing local progress changes to the cloud (debounced) for as long as they're signed in.
 */
export function useProgressCloudSync() {
  const user = useAuthStore((s) => s.user);
  const uidRef = useRef<string | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    unsubscribeRef.current?.();
    unsubscribeRef.current = null;
    if (timerRef.current) clearTimeout(timerRef.current);

    if (!user || !isFirebaseConfigured || !db) {
      uidRef.current = null;
      return;
    }

    uidRef.current = user.uid;
    let cancelled = false;

    (async () => {
      try {
        const ref = progressDocRef(user.uid);
        const snap = await getDoc(ref);
        if (cancelled) return;

        if (snap.exists() && isSyncableProgress(snap.data())) {
          useProgressStore.getState().hydrateFromRemote(snap.data() as SyncableProgress);
        } else {
          await setDoc(ref, { ...getSyncableProgress(), updatedAt: serverTimestamp() });
        }
      } catch (e) {
        console.warn('Progress cloud sync: initial sync failed', e);
      }

      unsubscribeRef.current = useProgressStore.subscribe(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          if (uidRef.current !== user.uid) return;
          setDoc(progressDocRef(user.uid), { ...getSyncableProgress(), updatedAt: serverTimestamp() }, { merge: true }).catch(
            (e) => console.warn('Progress cloud sync: write failed', e)
          );
        }, SYNC_DEBOUNCE_MS);
      });
    })();

    return () => {
      cancelled = true;
      unsubscribeRef.current?.();
      unsubscribeRef.current = null;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [user]);
}
