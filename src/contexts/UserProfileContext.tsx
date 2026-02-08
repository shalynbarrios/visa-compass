import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { OnboardingData } from '@/lib/api';

interface UserProfileContextType {
  profile: OnboardingData | null;
  setProfile: (data: OnboardingData) => void;
  clearProfile: () => void;
}

const STORAGE_KEY = 'visa-compass-user-profile';

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<OnboardingData | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  const setProfile = (data: OnboardingData) => {
    setProfileState(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const clearProfile = () => {
    setProfileState(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <UserProfileContext.Provider value={{ profile, setProfile, clearProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
}
