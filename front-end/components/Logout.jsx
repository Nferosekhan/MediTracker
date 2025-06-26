import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
export const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('rememberme');
    localStorage.removeItem('usertype');
    navigate('/');
  }, [navigate]);

  return null;
};
