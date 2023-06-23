import { useAuthStore } from '@/stores';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';

export const login = async (email: string, password: string) => {
  const auth = getAuth();
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    useAuthStore.getState().setUser(user);
    return { data: user, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
};

export const logout = async () => {
  await signOut(getAuth());
  useAuthStore.getState().setUser(null);
};
