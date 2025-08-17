'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '@/lib/api';
import { Manager } from '@/types';

interface AuthContextType {
  manager: Manager | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone?: string;
  }) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [manager, setManager] = useState<Manager | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const savedManager = localStorage.getItem('manager');
    
    if (token && savedManager) {
      try {
        setManager(JSON.parse(savedManager));
        apiService.setToken(token);
      } catch (error) {
        console.error('Error parsing saved manager:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('manager');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiService.login({ email, password });
      const { token, manager } = response;
      
      apiService.setToken(token);
      setManager(manager);
      localStorage.setItem('manager', JSON.stringify(manager));
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone?: string;
  }) => {
    try {
      const response = await apiService.register(data);
      const { token, manager } = response;
      
      apiService.setToken(token);
      setManager(manager);
      localStorage.setItem('manager', JSON.stringify(manager));
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    apiService.clearToken();
    setManager(null);
    localStorage.removeItem('manager');
  };

  // Fixed JSX syntax
  return React.createElement(
    AuthContext.Provider,
    { value: { manager, login, register, logout, loading } },
    children
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}