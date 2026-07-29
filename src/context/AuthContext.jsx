import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const response = await getCurrentUser();
          setCurrentUser(response.data);
        } catch (error) {
          console.error('Failed to initialize auth', error);
          localStorage.removeItem('accessToken');
        }
      }
      setIsInitializing(false);
    };

    initAuth();
  }, []);

  const login = (user, accessToken) => {
    localStorage.setItem('accessToken', accessToken);
    setCurrentUser(user);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isInitializing }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
