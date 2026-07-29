import { useState } from 'react';
import { loginUser, registerUser } from '../../api/authApi';
import { useAuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuthContext();
  const navigate = useNavigate();

  const handleLogin = async (data) => {
    setIsLoading(true);
    setErrors({});
    try {
      const response = await loginUser(data);
      login(response.data.user, response.data.accessToken);
      navigate('/');
    } catch (err) {
      if (err.errors) {
        setErrors(err.errors);
      } else {
        setErrors({ general: [err.message || 'Login failed'] });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data) => {
    setIsLoading(true);
    setErrors({});
    try {
      const response = await registerUser(data);
      login(response.data.user, response.data.accessToken);
      navigate('/');
    } catch (err) {
      if (err.errors) {
        setErrors(err.errors);
      } else {
        setErrors({ general: [err.message || 'Registration failed'] });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogin, handleRegister, isLoading, errors };
}
