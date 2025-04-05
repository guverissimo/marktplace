import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios, { AxiosError } from 'axios';

interface User {
  id: number;
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
  setUser: (user: User | null) => void;
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
      console.log('Enviando requisição de login:', { email });

      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email,
        password,
      });

      console.log('Resposta do login:', response.data);

      const { token, id, name, email: userEmail } = response.data;
      
      setToken(token);
      setUser({ id, name, email: userEmail });
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ id, name, email: userEmail }));
    } catch (error) {
      console.error('Erro no login:', error);
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data || 'Erro ao fazer login');
      }
      throw new Error('Erro ao fazer login');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      console.log('Enviando requisição de registro:', { name, email });

      const response = await axios.post('http://localhost:8080/api/auth/register', {
        name,
        email,
        password,
      });

      console.log('Resposta do registro:', response.data);

      const { token, id, email: userEmail } = response.data;
      
      setToken(token);
      setUser({ id, name, email: userEmail });
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ id, name, email: userEmail }));
    } catch (error) {
      console.error('Erro no registro:', error);
      if (error instanceof AxiosError) {
        throw error;
      }
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
        setUser,
      }}
    >
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