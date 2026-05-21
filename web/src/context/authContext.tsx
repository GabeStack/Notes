// src/context/authContext.tsx
import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react';
import { queryClient } from '@/api/queryClient'; // ✅ Import adicionado
import { authEvents } from '@/api/authEvents'; // ✅ novo import

interface User {
  id: string;
  name: string;
  email: string;
  emailVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  checkAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
  const unsubscribe = authEvents.onUnauthorized(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    // O redirect fica aqui, depois do estado React já limpo
    window.location.href = '/login';
  });

  return unsubscribe;
}, []);

  const login = useCallback((newToken: string, newUser: User) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    queryClient.clear(); // ✅ Limpa cache do React Query
  }, []);

  const checkAuth = useCallback(() => {
    const stored = localStorage.getItem('token');
    if (stored !== token) setToken(stored);
    return !!stored;
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, user, isLoading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}