import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function useSession() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading) {
      const isAuthPage = location.pathname === '/' || location.pathname === '/login';
      const isAppPage = location.pathname.startsWith('/app');

      // If user is logged in but on auth pages, redirect to app
      if (user && isAuthPage) {
        navigate('/app/discover', { replace: true });
      }
      
      // If user is not logged in but on app pages, redirect to landing
      if (!user && isAppPage) {
        navigate('/', { replace: true });
      }
    }
  }, [user, isLoading, location.pathname, navigate]);

  return { user, isLoading };
}