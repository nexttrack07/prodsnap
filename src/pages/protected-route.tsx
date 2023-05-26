import { Navigate } from 'react-router-dom';
import { User } from './login';

type Props = {
  user: User | null;
  redirectPath?: string;
  children: JSX.Element;
};

export function ProtectedRoute({ user, redirectPath = '/login', children }: Props) {
  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}
