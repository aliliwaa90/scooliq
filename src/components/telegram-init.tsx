'use client';

import { useEffect } from 'react';
import { useStore } from '@/lib/store';

function buildTelegramUser() {
  const webApp = window.Telegram?.WebApp;
  const telegramUser = webApp?.initDataUnsafe?.user;
  const currentUser = useStore.getState().user;

  if (!telegramUser) {
    return null;
  }

  return {
    id: String(telegramUser.id),
    firstName: telegramUser.first_name ?? currentUser?.firstName ?? 'مستخدم',
    lastName: telegramUser.last_name ?? currentUser?.lastName ?? '',
    username: telegramUser.username ?? currentUser?.username ?? '',
    avatar: telegramUser.photo_url ?? currentUser?.avatar ?? '',
    stage: currentUser?.stage ?? '',
    grade: currentUser?.grade ?? '',
    province: currentUser?.province ?? '',
    role: currentUser?.role ?? 'student',
  } as const;
}

export default function TelegramInit() {
  const setUser = useStore((state) => state.setUser);
  const syncDark = useStore((state) => state.syncDark);

  useEffect(() => {
    const webApp = window.Telegram?.WebApp;
    if (!webApp) {
      return;
    }

    webApp.ready();
    webApp.expand();

    const nextUser = buildTelegramUser();
    if (nextUser) {
      setUser(nextUser);
    }

    const syncTheme = () => {
      const hasSavedTheme = window.localStorage.getItem('theme');
      if (!hasSavedTheme) {
        syncDark(webApp.colorScheme === 'dark');
      }
    };

    syncTheme();
    webApp.onEvent?.('themeChanged', syncTheme);

    return () => {
      webApp.offEvent?.('themeChanged', syncTheme);
    };
  }, [setUser, syncDark]);

  return null;
}
