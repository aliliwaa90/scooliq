'use client';

import { create } from 'zustand';

interface UserState {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    avatar: string;
    stage: string;
    grade: string;
    province: string;
    role: 'student' | 'admin';
  } | null;
  isDark: boolean;
  favorites: string[];
  watchHistory: string[];
  setUser: (user: UserState['user']) => void;
  toggleTheme: () => void;
  setDark: (dark: boolean) => void;
  syncDark: (dark: boolean) => void;
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  addToHistory: (id: string) => void;
}

export const useStore = create<UserState>((set, get) => ({
  user: {
    id: 'u1',
    firstName: 'أحمد',
    lastName: 'العراقي',
    username: 'ahmed_iq',
    avatar: '',
    stage: 'متوسط',
    grade: 'g9',
    province: 'بغداد',
    role: 'student',
  },
  isDark: false,
  favorites: [],
  watchHistory: [],
  setUser: (user) => set({ user }),
  toggleTheme: () => {
    const newDark = !get().isDark;
    set({ isDark: newDark });
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('dark', newDark);
      localStorage.setItem('theme', newDark ? 'dark' : 'light');
    }
  },
  setDark: (dark) => {
    set({ isDark: dark });
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('dark', dark);
      localStorage.setItem('theme', dark ? 'dark' : 'light');
    }
  },
  syncDark: (dark) => {
    set({ isDark: dark });
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('dark', dark);
    }
  },
  addFavorite: (id) => set((s) => ({ favorites: [...s.favorites, id] })),
  removeFavorite: (id) => set((s) => ({ favorites: s.favorites.filter((f) => f !== id) })),
  addToHistory: (id) => set((s) => ({
    watchHistory: [id, ...s.watchHistory.filter((h) => h !== id)].slice(0, 50),
  })),
}));
