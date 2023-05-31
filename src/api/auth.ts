import { User, useAuthStore } from '@/stores';
// import { getClient } from './client';
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';
import axios from 'axios';

type LoginResponse = {
  refresh: string;
  access: string;
};

const BASE_URL = import.meta.env.VITE_API_URL as string;

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post<LoginResponse>(BASE_URL +'/auth/token/', { email, password });
    console.log('response', response);
    if (response.status === 200) {
      // set user to store
      setAuthUser(response.data.access, response.data.refresh);
    }

    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const logout = () => {
  Cookies.remove('access_token');
  Cookies.remove('refresh_token');
  useAuthStore.getState().setUser(null);
};

export const setUser = async () => {
  const accessToken = Cookies.get('access_token');
  const refreshToken = Cookies.get('refresh_token');

  if (!accessToken || !refreshToken) {
    return;
  }

  if (isAccessTokenExpired(accessToken)) {
    const response = await getRefreshToken(refreshToken);
    setAuthUser(response.access, response.refresh);
} else {
    setAuthUser(accessToken, refreshToken);
}
};

type Token = User & {
  token_type: string;
  exp: number;
  jti: string;
  iat: number;
}

export function isAccessTokenExpired(accessToken: string) {
  try {
    const decodedToken = jwt_decode<Token>(accessToken);
    console.log('decodedToken', decodedToken);
    return decodedToken.exp < Date.now() / 1000;
  } catch (err) {
    return true; // Token is invalid or expired
  }
}

export const getRefreshToken = async (refresh_token?: string) => {
  if (!refresh_token) {
    refresh_token = Cookies.get('refresh_token') ?? '';
  }
  const response = await axios.post<LoginResponse>(BASE_URL + 'token/refresh/', {
      refresh: refresh_token,
  });
  return response.data;
};

export const setAuthUser = (access_token: string, refresh_token: string) => {
  Cookies.set('access_token', access_token, {
      expires: 1,
      secure: true,
  });

  Cookies.set('refresh_token', refresh_token, {
      expires: 7,
      secure: true,
  });

  const user = jwt_decode<Token>(access_token) ?? null;

  if (user) {
      useAuthStore.getState().setUser({ user_id: user.user_id, username: user.username, email: user.email });
  }
  useAuthStore.getState().setLoading(false);
};