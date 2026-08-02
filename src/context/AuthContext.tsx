import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { EducationLevel, StudentProfile, CareerDnaResult } from '../types';

export interface UserProfileData {
  uid: string;
  name: string;
  email: string;
  educationLevel?: EducationLevel;
  createdAt?: string;
  lastLoginAt?: string;
}

interface AuthContextType {
  user: { uid: string; email: string; name: string } | null;
  userProfile: UserProfileData | null;
  loading: boolean;
  token: string | null;
  registerUser: (name: string, email: string, pass: string, eduLevel?: EducationLevel) => Promise<void>;
  loginUser: (email: string, pass: string) => Promise<void>;
  logoutUser: () => Promise<void>;
  resetUserPassword: (email: string) => Promise<void>;
  saveProfileToDatabase: (profile: StudentProfile, careerDna: CareerDnaResult) => Promise<void>;
  loadProfileFromDatabase: () => Promise<{ profile: StudentProfile; careerDna: CareerDnaResult } | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'unfold_ai_db_jwt_token';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ uid: string; email: string; name: string } | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState<boolean>(true);

  // Restore user session on initial load if token exists in localStorage
  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (storedToken) {
        try {
          const res = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${storedToken}` }
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
            setUserProfile({
              uid: data.user.uid,
              name: data.user.name,
              email: data.user.email,
              educationLevel: data.user.educationLevel || 'graduation'
            });
            setToken(storedToken);
          } else {
            localStorage.removeItem(TOKEN_KEY);
            setToken(null);
            setUser(null);
            setUserProfile(null);
          }
        } catch (err) {
          console.error('Error verifying database session:', err);
        }
      }
      setLoading(false);
    };

    restoreSession();
  }, []);

  const registerUser = async (name: string, email: string, pass: string, eduLevel?: EducationLevel) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password: pass, educationLevel: eduLevel || 'graduation' })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to register account');
    }

    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
    setUser(data.user);
    setUserProfile(data.user);
  };

  const loginUser = async (email: string, pass: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to sign in');
    }

    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
    setUser(data.user);
    setUserProfile(data.user);
  };

  const logoutUser = async () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setUserProfile(null);
  };

  const resetUserPassword = async (email: string) => {
    // Standard mock notification for reset request
    await new Promise((resolve) => setTimeout(resolve, 800));
  };

  const saveProfileToDatabase = async (profile: StudentProfile, careerDna: CareerDnaResult) => {
    const activeToken = token || localStorage.getItem(TOKEN_KEY);
    if (!activeToken) return;

    try {
      await fetch('/api/user/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${activeToken}`
        },
        body: JSON.stringify({ profile, careerDna })
      });
    } catch (err) {
      console.error('Error saving profile to PostgreSQL:', err);
    }
  };

  const loadProfileFromDatabase = async (): Promise<{ profile: StudentProfile; careerDna: CareerDnaResult } | null> => {
    const activeToken = token || localStorage.getItem(TOKEN_KEY);
    if (!activeToken) return null;

    try {
      const res = await fetch('/api/user/profile', {
        headers: { Authorization: `Bearer ${activeToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.profile && data.careerDna) {
          return {
            profile: data.profile,
            careerDna: data.careerDna
          };
        }
      }
    } catch (err) {
      console.error('Error loading profile from PostgreSQL:', err);
    }
    return null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        token,
        registerUser,
        loginUser,
        logoutUser,
        resetUserPassword,
        saveProfileToDatabase,
        loadProfileFromDatabase
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
