import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeMode, Theme } from '../types';
import { getTheme } from '../utils/theme';

interface ThemeStore {
  mode: ThemeMode;
  theme: Theme;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      mode: 'system',
      theme: getTheme('light'),
      setThemeMode: (mode: ThemeMode) => {
        const actualMode = mode === 'system' ? 'light' : mode;
        set({ 
          mode, 
          theme: getTheme(actualMode) 
        });
      },
      toggleTheme: () => {
        const { mode } = get();
        const newMode = mode === 'light' ? 'dark' : 'light';
        set({ 
          mode: newMode, 
          theme: getTheme(newMode) 
        });
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);