import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ThemeMode, Theme } from '../types';
import { getTheme } from '../utils/theme';

interface ThemeState {
  mode: ThemeMode;
  theme: Theme;
}

const initialState: ThemeState = {
  mode: 'system',
  theme: getTheme('light'),
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      const mode = action.payload;
      const actualMode = mode === 'system' ? 'light' : mode;
      state.mode = mode;
      state.theme = getTheme(actualMode);
    },
    toggleTheme: (state) => {
      const newMode = state.mode === 'light' ? 'dark' : 'light';
      state.mode = newMode;
      state.theme = getTheme(newMode);
    },
  },
});

export const { setThemeMode, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;