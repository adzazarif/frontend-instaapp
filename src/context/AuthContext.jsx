import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      const savedUser = localStorage.getItem('currentUser');

      if (token && savedUser) {
        // Load instantly from localStorage
        try {
          setCurrentUser(JSON.parse(savedUser));
        } catch (e) {
          console.error('Failed to parse cached user', e);
        }
        setIsInitializing(false); // App renders immediately!
        
        // Refresh data in background to keep it up to date and verify token
        try {
          const response = await getCurrentUser();
          setCurrentUser(response.data);
          localStorage.setItem('currentUser', JSON.stringify(response.data));
        } catch (error) {
          console.error('Session expired or invalid token', error);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('currentUser');
          setCurrentUser(null);
        }
      } else if (token) {
        // Fallback if no user data is cached but token exists
        try {
          const response = await getCurrentUser();
          setCurrentUser(response.data);
          localStorage.setItem('currentUser', JSON.stringify(response.data));
        } catch (error) {
          console.error('Failed to initialize auth', error);
          localStorage.removeItem('accessToken');
        }
        setIsInitializing(false);
      } else {
        setIsInitializing(false);
      }
    };

    initAuth();
  }, []);

  const login = (user, accessToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('currentUser', JSON.stringify(user));
    setCurrentUser(user);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isInitializing }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
