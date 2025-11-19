import { useCallback, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import type { LoginRequest, LoginResponse } from '@/client';
import { useAuthLogin } from './useAuthApi';

const TOKEN_KEY = 'hjpalm.token';
const TOKEN_TIMESTAMP_KEY = 'hjpalm.token_saved_at';
const LOCK_FLAG_KEY = 'hjpalm.locked_at';
const LOCK_REDIRECT_KEY = 'hjpalm.lock_redirect';

const readToken = (): LoginResponse | null => {
  const raw = typeof window !== 'undefined' ? window.localStorage.getItem(TOKEN_KEY) : null;
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as LoginResponse;
  } catch {
    return null;
  }
};

const removeStoredToken = () => {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(TOKEN_TIMESTAMP_KEY);
};

const storeTokenInternal = (token: LoginResponse) => {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
  window.localStorage.setItem(TOKEN_TIMESTAMP_KEY, Date.now().toString());
};

const computeLoggedIn = () => {
  if (typeof window === 'undefined') {
    return false;
  }
  const token = readToken();
  const savedAt = window.localStorage.getItem(TOKEN_TIMESTAMP_KEY);
  if (!token || !savedAt) {
    return false;
  }
  const savedAtValue = Number(savedAt);
  if (Number.isNaN(savedAtValue) || typeof token.expires_in !== 'number') {
    return Boolean(token.access_token);
  }
  return Date.now() < savedAtValue + token.expires_in * 1000;
};

const getStoredLockPath = () =>
  typeof window !== 'undefined' ? window.localStorage.getItem(LOCK_REDIRECT_KEY) : null;

const clearLockStorage = () => {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.removeItem(LOCK_FLAG_KEY);
  window.localStorage.removeItem(LOCK_REDIRECT_KEY);
};

const computeLocked = () =>
  typeof window !== 'undefined' ? Boolean(window.localStorage.getItem(LOCK_FLAG_KEY)) : false;

export function useAuth() {
  const navigate = useNavigate();
  const location = useLocation();
  const loginMutation = useAuthLogin();
  const [loggedIn, setLoggedIn] = useState(() => computeLoggedIn());
  const [currentUser, setCurrentUser] = useState(() => readToken()?.user ?? null);
  const [locked, setLocked] = useState(() => computeLocked());

  const storeToken = useCallback((token: LoginResponse) => {
    storeTokenInternal(token);
    setLoggedIn(true);
    setCurrentUser(token.user ?? null);
  }, []);

  const removeToken = useCallback(() => {
    removeStoredToken();
    clearLockStorage();
    setLoggedIn(false);
    setCurrentUser(null);
    setLocked(false);
  }, []);

  const getToken = useCallback(() => readToken(), []);

  const isLoggedIn = useCallback(() => computeLoggedIn(), []);

  const login = useCallback(
    async (payload: LoginRequest) => {
      const data = await loginMutation.mutateAsync({ body: payload });
      storeToken(data);
      setLocked(false);
      clearLockStorage();
      return data;
    },
    [loginMutation, storeToken],
  );

  const lock = useCallback(() => {
    if (typeof window !== 'undefined') {
      const redirectPath =
        location.pathname === '/auth/lock-screen'
          ? getStoredLockPath() ?? '/'
          : `${location.pathname}${location.search}${location.hash}`;
      window.localStorage.setItem(LOCK_REDIRECT_KEY, redirectPath ?? '/');
      window.localStorage.setItem(LOCK_FLAG_KEY, Date.now().toString());
    }
    setLocked(true);
    navigate('/auth/lock-screen', { replace: true });
  }, [location.hash, location.pathname, location.search, navigate]);

  const unlock = useCallback(
    (overridePath?: string) => {
      const target = overridePath ?? getStoredLockPath() ?? '/';
      clearLockStorage();
      setLocked(false);
      navigate(target, { replace: true });
    },
    [navigate],
  );

  const logout = useCallback(() => {
    if (window.location.pathname !== '/auth/sign-in') {
      removeToken();
      navigate('/auth/sign-in', { replace: true });
    } else {
      removeToken();
    }
  }, [navigate, removeToken]);

  return useMemo(
    () => ({
      login,
      loginMutation,
      loggedIn,
      logout,
      isLoggedIn,
      getToken,
      user: currentUser,
      locked,
      lock,
      unlock,
      storeToken,
      removeToken,
    }),
    [
      currentUser,
      getToken,
      isLoggedIn,
      lock,
      locked,
      loggedIn,
      login,
      loginMutation,
      logout,
      removeToken,
      storeToken,
      unlock,
    ],
  );
}

export type UseAuthReturn = ReturnType<typeof useAuth>;
