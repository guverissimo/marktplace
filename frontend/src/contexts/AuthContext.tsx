import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email,
        password,
      });

      const { token, name, email: userEmail } = response.data;
      
      setToken(token);
      setUser({ name, email: userEmail });
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ name, email: userEmail }));
    } catch (error) {
      throw new Error('Erro ao fazer login');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/register', {
        name,
        email,
        password,
      });

      const { token, email: userEmail } = response.data;
      
      setToken(token);
      setUser({ name, email: userEmail });
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ name, email: userEmail }));
    } catch (error) {
      throw new Error('Erro ao registrar usuário');
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
} 