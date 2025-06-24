
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Usuários mockados para demonstração
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@pizza.com',
    name: 'Super Administrador',
    role: 'super_admin',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: '2024-06-24T10:00:00Z',
  },
  {
    id: '2',
    email: 'bellavista@admin.com',
    name: 'João Silva',
    role: 'admin',
    tenantId: 'tenant-1',
    isActive: true,
    createdAt: '2024-01-15T00:00:00Z',
    lastLogin: '2024-06-23T18:30:00Z',
  },
  {
    id: '3',
    email: 'bellavista@atendente.com',
    name: 'Maria Santos',
    role: 'attendant',
    tenantId: 'tenant-1',
    isActive: true,
    createdAt: '2024-02-01T00:00:00Z',
    lastLogin: '2024-06-24T09:15:00Z',
  },
  {
    id: '4',
    email: 'express@admin.com',
    name: 'Carlos Oliveira',
    role: 'admin',
    tenantId: 'tenant-2',
    isActive: true,
    createdAt: '2024-02-01T00:00:00Z',
    lastLogin: '2024-06-20T16:45:00Z',
  },
  {
    id: '5',
    email: 'express@atendente.com',
    name: 'Ana Costa',
    role: 'attendant',
    tenantId: 'tenant-2',
    isActive: false,
    createdAt: '2024-03-01T00:00:00Z',
    lastLogin: '2024-06-10T14:20:00Z',
  },
];

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulação de login com múltiplos usuários
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser && password === 'admin123') {
      // Atualizar último login
      const updatedUser = { 
        ...foundUser, 
        lastLogin: new Date().toISOString() 
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } else {
      throw new Error('Credenciais inválidas');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
