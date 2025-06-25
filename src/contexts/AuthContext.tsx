
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  addUser: (user: User, password: string) => void;
  updateUser: (user: User) => void;
  removeUser: (userId: string) => void;
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
const initialUsers: User[] = [
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

// Senhas dos usuários (em produção, isso seria criptografado)
const initialPasswords: { [key: string]: string } = {
  'admin@pizza.com': 'admin123',
  'bellavista@admin.com': 'admin123',
  'bellavista@atendente.com': 'admin123',
  'express@admin.com': 'admin123',
  'express@atendente.com': 'admin123',
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>(() => {
    const stored = localStorage.getItem('systemUsers');
    return stored ? JSON.parse(stored) : initialUsers;
  });
  const [passwords, setPasswords] = useState<{ [key: string]: string }>(() => {
    const stored = localStorage.getItem('systemPasswords');
    return stored ? JSON.parse(stored) : initialPasswords;
  });

  // Salvar usuários e senhas no localStorage
  useEffect(() => {
    localStorage.setItem('systemUsers', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('systemPasswords', JSON.stringify(passwords));
  }, [passwords]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // Verificar se o usuário ainda existe e está ativo
      const currentUser = users.find(u => u.id === parsedUser.id);
      if (currentUser && currentUser.isActive) {
        setUser(currentUser);
      } else {
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, [users]);

  const login = async (email: string, password: string) => {
    // Encontrar usuário pelo email
    const foundUser = users.find(u => u.email === email);
    
    if (!foundUser) {
      throw new Error('Usuário não encontrado');
    }

    if (!foundUser.isActive) {
      throw new Error('Usuário inativo. Entre em contato com o administrador.');
    }

    // Verificar senha
    if (passwords[email] !== password) {
      throw new Error('Senha incorreta');
    }

    // Atualizar último login
    const updatedUser = { 
      ...foundUser, 
      lastLogin: new Date().toISOString() 
    };

    // Atualizar na lista de usuários
    setUsers(prevUsers => 
      prevUsers.map(u => u.id === foundUser.id ? updatedUser : u)
    );

    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const addUser = (newUser: User, password: string) => {
    setUsers(prevUsers => [...prevUsers, newUser]);
    setPasswords(prevPasswords => ({
      ...prevPasswords,
      [newUser.email]: password
    }));
  };

  const updateUser = (updatedUser: User) => {
    setUsers(prevUsers => 
      prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u)
    );
    
    // Se o usuário logado foi atualizado, atualizar também o estado atual
    if (user && user.id === updatedUser.id) {
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const removeUser = (userId: string) => {
    const userToRemove = users.find(u => u.id === userId);
    if (userToRemove) {
      setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
      setPasswords(prevPasswords => {
        const newPasswords = { ...prevPasswords };
        delete newPasswords[userToRemove.email];
        return newPasswords;
      });
      
      // Se o usuário removido está logado, fazer logout
      if (user && user.id === userId) {
        logout();
      }
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isLoading, 
      addUser, 
      updateUser, 
      removeUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
