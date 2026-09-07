import { useEffect } from 'react';
import { create } from 'zustand';
import type { User } from 'firebase/auth';
import { subscribeToAuthChanges } from '../services/authService';

interface AuthState {
  user: User | null;
  /** True until the first auth-state callback fires (avoids a sign-in flash on launch). */
  initializing: boolean;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  initializing: true,
  setUser: (user) => set({ user, initializing: false }),
}));

/** Mount once near the app root to keep useAuthStore in sync with Firebase auth state. */
export function useAuthBootstrap() {
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(setUser);
    return unsubscribe;
  }, [setUser]);
}
