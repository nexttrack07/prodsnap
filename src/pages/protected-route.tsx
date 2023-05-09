import { Navigate } from 'react-router-dom';
import { USER } from './login';

type Props = {
  user: USER | null;
  redirectPath?: string;
  children: JSX.Element;
};

export function ProtectedRoute({ user, redirectPath = '/login', children }: Props) {
  if (!user?.token) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}
