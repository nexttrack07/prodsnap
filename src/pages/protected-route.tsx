import { useAuthStore } from '@/stores';
import { Navigate } from 'react-router-dom';

type Props = {
  redirectPath?: string;
  children: JSX.Element;
};

export function ProtectedRoute({ redirectPath = '/login', children }: Props) {
  const loggedIn = useAuthStore((state) => state.isLoggedIn)();
  if (!loggedIn) {
    return <Navigate to={redirectPath} />;
  }
  return children;
}
