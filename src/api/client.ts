import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

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
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.instance.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        const loginObject = JSON.parse(localStorage.getItem('login') || '{}');
        const token = loginObject.state?.user?.token;
        if (token) {
          config.headers = {
            ...config.headers,
            Authorization: `Token ${token}`,
          };
        }
  
        return config;
      },
      (error) => Promise.reject(error)
    );
  }
  

  async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.get<T>(url, config);
  }

  async post<T = unknown>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.post<T>(url, data, config);
  }

  async put<T = unknown>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.put<T>(url, data, config);
  }

  async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.delete<T>(url, config);
  }
}


export const client = new ApiClient(import.meta.env.VITE_API_URL as string);