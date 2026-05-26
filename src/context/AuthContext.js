import React, { createContext, useContext, useMemo, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COUPLE } from '../data';

const AuthContext = createContext(null);
const STORAGE_USER_KEY = '@coupleconnect:userId';
const STORAGE_ACCOUNTS_KEY = '@coupleconnect:accounts';

const DEFAULT_USERS = [
  { id: 'alex', name: COUPLE.name1, email: 'alex@example.com', password: 'love123' },
  { id: 'jordan', name: COUPLE.name2, email: 'jordan@example.com', password: 'love123' },
];

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function createUserId(email) {
  return `${email.replace(/[^a-z0-9]/g, '')}-${Date.now()}`;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [storedAccounts, setStoredAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const users = useMemo(() => [...DEFAULT_USERS, ...storedAccounts], [storedAccounts]);

  useEffect(() => {
    let canceled = false;

    async function restoreUser() {
      try {
        const [storedId, storedAccountsValue] = await Promise.all([
          AsyncStorage.getItem(STORAGE_USER_KEY),
          AsyncStorage.getItem(STORAGE_ACCOUNTS_KEY),
        ]);

        const savedAccounts = storedAccountsValue ? JSON.parse(storedAccountsValue) : [];
        if (!canceled) setStoredAccounts(Array.isArray(savedAccounts) ? savedAccounts : []);

        if (!canceled && storedId) {
          const found = [...DEFAULT_USERS, ...(Array.isArray(savedAccounts) ? savedAccounts : [])].find((u) => u.id === storedId);
          if (found) {
            setUser(found);
          }
        }
      } catch (error) {
        // ignore restore failures
      } finally {
        if (!canceled) setLoading(false);
      }
    }

    restoreUser();
    return () => { canceled = true; };
  }, []);

  const persistAccounts = useCallback(async (accounts) => {
    try {
      await AsyncStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(accounts));
      setStoredAccounts(accounts);
      return true;
    } catch {
      return false;
    }
  }, []);

  const loginWithId = useCallback(async (id) => {
    const found = users.find((u) => u.id === id);
    if (!found) return false;

    try {
      await AsyncStorage.setItem(STORAGE_USER_KEY, found.id);
      setUser(found);
      return true;
    } catch {
      return false;
    }
  }, [users]);

  const loginWithEmail = useCallback(async (email, password) => {
    const normalizedEmail = normalizeEmail(email);
    const found = users.find(
      (u) => u.email.toLowerCase() === normalizedEmail && u.password === password,
    );
    if (!found) return false;

    try {
      await AsyncStorage.setItem(STORAGE_USER_KEY, found.id);
      setUser(found);
      return true;
    } catch {
      return false;
    }
  }, [users]);

  const register = useCallback(async (name, email, password) => {
    const normalizedEmail = normalizeEmail(email);
    if (!name.trim() || !normalizedEmail || !password) {
      return false;
    }

    const exists = users.some((u) => u.email.toLowerCase() === normalizedEmail);
    if (exists) {
      return false;
    }

    const newUser = {
      id: createUserId(normalizedEmail),
      name: name.trim(),
      email: normalizedEmail,
      password,
    };

    const nextAccounts = [...storedAccounts, newUser];
    const persisted = await persistAccounts(nextAccounts);
    if (!persisted) {
      return false;
    }

    try {
      await AsyncStorage.setItem(STORAGE_USER_KEY, newUser.id);
      setUser(newUser);
      return true;
    } catch {
      return false;
    }
  }, [storedAccounts, users, persistAccounts]);

  const logout = useCallback(async () => {
    setUser(null);
    try {
      await AsyncStorage.removeItem(STORAGE_USER_KEY);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo(() => ({
    user,
    users,
    loginWithId,
    loginWithEmail,
    register,
    logout,
    loading,
  }), [user, users, loginWithId, loginWithEmail, register, logout, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
