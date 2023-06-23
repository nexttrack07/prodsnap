import { getRefreshToken, setAuthUser } from '@/api/auth';
import { useAuthStore } from '@/stores';
import { LoadingOverlay } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';

type Props = {
  redirectPath?: string;
  children: JSX.Element;
};

// export function ProtectedRoute({ redirectPath = '/login', children }: Props) {
//   const loggedIn = useAuthStore((state) => state.isLoggedIn)();
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     async function checkLogin() {
//       try {
//         setLoading(true);
//         const { refresh, access } = await getRefreshToken();
//         setAuthUser(access, refresh);
//         navigate('/editor');
//       } catch (e) {
//         console.log('refresh error', e);
//       } finally {
//         setLoading(false);
//       }
//     }

//     if (!loggedIn) {
//       const refreshToken = Cookies.get('refresh_token');
//       refreshToken && checkLogin();
//     } else {
//       navigate('/editor');
//     }
//   }, []);

//   if (loading) {
//     return <LoadingOverlay visible />;
//   }
//   return children;
// }

export function ProtectedRoute({ redirectPath = '/login', children }: Props) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

// separate functions vs single express
// what do you for blog and homepage seo?
