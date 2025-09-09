'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  isLoggedIn: boolean;
  user: { policeId: string } | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getUserFromToken = (token: string | null) => {
  if (!token) return null;
  try {
    const decoded: { sub: string } = jwtDecode(token);
    return { policeId: decoded.sub };
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ policeId: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      setUser(getUserFromToken(token));
      setIsLoggedIn(true);
    }
  }, []);

  const login = (token: string) => {
    sessionStorage.setItem('authToken', token);
    sessionStorage.setItem('isLoggedIn', 'true');
    setUser(getUserFromToken(token));
    setIsLoggedIn(true);
    router.push('/');
  };

  const logout = () => {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

