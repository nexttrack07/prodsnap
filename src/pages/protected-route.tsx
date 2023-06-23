import { useAuthStore } from '@/stores';
import { LoadingOverlay } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '@/utils/firebase';

type Props = {
  redirectPath?: string;
  children: JSX.Element;
};

export function ProtectedRoute({ redirectPath = '/login', children }: Props) {
  const setUser = useAuthStore((state) => state.setUser);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(false);
      if (!user) {
        console.log('user not found');
        setUser(null);
        navigate(redirectPath); // redirect to login page
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (loading) {
    return <LoadingOverlay visible />;
  }
  return children;
}
