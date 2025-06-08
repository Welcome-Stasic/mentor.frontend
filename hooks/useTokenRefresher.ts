'use client';

import { getRefreshToken } from '@/mentorApi';
import { getCookie, setCookie } from 'cookies-next';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { useEffect, useRef } from 'react';

const REFRESH_THRESHOLD_SEC = 5 * 60; // 5 минут в секундах

export default function useTokenRefresher() {
  const activityTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastActivityTime = useRef<number>(Date.now());
  const refreshing = useRef(false);

  // Функция проверки и обновления токена
  const checkAndRefreshToken = async () => {
    if (refreshing.current) return; // Уже обновляем — ждём

    const token = await getCookie('token');

    if (!token) return;

    const payload = jwtDecode<JwtPayload>(token);

    if (!payload || !payload.exp) return;

    const nowSec = Date.now() / 1000;
    const expiresIn = payload.exp - nowSec;

    if (expiresIn > REFRESH_THRESHOLD_SEC) return; // Токен ещё валиден дольше 5 мин

    // Проверяем, что пользователь был активен в последние 5 минут
    if (Date.now() - lastActivityTime.current > REFRESH_THRESHOLD_SEC * 1000) return;

    refreshing.current = true;

    try {
      const result = await getRefreshToken();

      const newToken = result?.Result ?? '';

      if (newToken) {
        setCookie('token', newToken, {
          maxAge: jwtDecode(newToken),
          path: '/',
          sameSite: 'none',
          secure: true,
        });

        lastActivityTime.current = Date.now();
      }
    } catch (error: unknown) {
      console.error('Ошибка обновления токена', error);
    } finally {
      refreshing.current = false;
    }
  };

  // Функция обновления времени активности
  const updateActivity = () => {
    lastActivityTime.current = Date.now();

    // Очистим и заново запустим таймер проверки токена через 1 минуту после активности
    if (activityTimeout.current) clearTimeout(activityTimeout.current);
    activityTimeout.current = setTimeout(() => {
      checkAndRefreshToken();
    }, 60 * 1000);
  };

  useEffect(() => {
    // Подписываемся на события активности
    const events = ['click', 'scroll', 'keydown', 'input'];
    events.forEach((event) => window.addEventListener(event, updateActivity));

    // При монтировании сразу запускаем проверку и таймер
    updateActivity();

    return () => {
      events.forEach((event) => window.removeEventListener(event, updateActivity));
      if (activityTimeout.current) clearTimeout(activityTimeout.current);
    };
  }, []);
}
