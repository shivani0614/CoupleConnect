import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PROFILE_KEY = '@couple_connect_profile';

const DEFAULT_PROFILE = {
  yourName: '',
  yourAvatar: null,       // base64 or null
  partnerName: '',
  partnerAvatar: null,
  anniversaryDate: null,  // ISO string or null
  savingsGoal: '',
  currency: 'USD',
};

const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'GBP', symbol: '£', label: 'British Pound' },
  { code: 'INR', symbol: '₹', label: 'Indian Rupee' },
  { code: 'CAD', symbol: 'CA$', label: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', label: 'Australian Dollar' },
  { code: 'JPY', symbol: '¥', label: 'Japanese Yen' },
];

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const saved = await AsyncStorage.getItem(PROFILE_KEY);
      if (saved) setProfile({ ...DEFAULT_PROFILE, ...JSON.parse(saved) });
    } catch (e) {
      console.error('Failed to load profile', e);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    const updated = { ...profile, ...updates };
    setProfile(updated);
    try {
      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save profile', e);
    }
  };

  const getCurrencySymbol = () =>
    CURRENCIES.find(c => c.code === profile.currency)?.symbol || '$';

  const formatAmount = (val) => {
    const sym = getCurrencySymbol();
    return `${sym}${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, loading, CURRENCIES, getCurrencySymbol, formatAmount }}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider');
  return ctx;
};
