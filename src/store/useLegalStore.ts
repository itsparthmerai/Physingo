import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LegalState {
  hasAcceptedPrivacyPolicy: boolean;
  hasHydrated: boolean;
  acceptPrivacyPolicy: () => void;
  setHydrated: () => void;
}

export const useLegalStore = create<LegalState>()(
  persist(
    (set) => ({
      hasAcceptedPrivacyPolicy: false,
      hasHydrated: false,
      acceptPrivacyPolicy: () => set({ hasAcceptedPrivacyPolicy: true }),
      setHydrated: () => set({ hasHydrated: true }),
    }),
    {
      name: 'physingo-legal',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ hasAcceptedPrivacyPolicy: state.hasAcceptedPrivacyPolicy }),
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    }
  )
);
