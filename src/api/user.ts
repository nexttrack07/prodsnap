import { client } from './client';

export async function signInWithEmailAndPassword(email: string, password: string) {
  return client.post<{ key: string }>('/auth/login/', { email, password });
}