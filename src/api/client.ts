import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { getRefreshToken, isAccessTokenExpired, setAuthUser } from './auth';

interface IApiClient {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
}

class ApiClient implements IApiClient {
  private instance: AxiosInstance;

  constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.instance.interceptors.request.use(
      async (config: AxiosRequestConfig) => {
        console.log('config', config)
        const accessToken = Cookies.get('access_token');
        const refreshToken = Cookies.get('refresh_token');

        if (accessToken && !isAccessTokenExpired(accessToken)) return {
          ...config,
          headers: {
            ...config.headers,
            Authorization: `Bearer ${accessToken}`
          }
        };

        const res = await getRefreshToken(refreshToken);
        setAuthUser(res.access, res.refresh);

        return {
          ...config,
          headers: {
            ...config.headers,
            Authorization: `Bearer ${res.access}`
          }
        };
      },
      (error) => Promise.reject(error)
    );
  }

  async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.get<T>(url, config);
  }

  async post<T = unknown>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    console.log('post', url, data, config)
    return this.instance.post<T>(url, data, config);
  }

  async put<T = unknown>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.put<T>(url, data, config);
  }

  async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.delete<T>(url, config);
  }
}

export const client = new ApiClient(import.meta.env.VITE_API_URL as string);
