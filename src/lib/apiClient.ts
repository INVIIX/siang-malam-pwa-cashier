import axios, { AxiosError, AxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const AUTO_REFRESH_TOKEN = false;

const apiClient = axios.create({
    baseURL: API_BASE_URL
});

// Ambil token dari localStorage
const getAccessToken = () => localStorage.getItem('access_token');
const setAccessToken = (token: string) => localStorage.setItem('access_token', token);
const clearAccessToken = () => localStorage.removeItem('access_token');

export let isRefreshing = false;

export const setRefreshing = (state: boolean) => {
    isRefreshing = state;
};

let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (err: any) => void;
}> = [];

const processQueue = (error: any, token: string | null) => {
    failedQueue.forEach(prom => {
        if (error) prom.reject(error);
        else prom.resolve(token!);
    });
    failedQueue = [];
};

const autoRefresh = async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.status === 401 && !originalRequest._retry &&
        !originalRequest.url?.includes('/auth/refresh')) {
        originalRequest._retry = true;

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then((token) => {
                if (typeof token === 'string') {
                    if (!originalRequest.headers) originalRequest.headers = {};
                    originalRequest.headers['Authorization'] = `Bearer ${token}`;
                }
                return apiClient(originalRequest);
            });
        }

        setRefreshing(true);
        try {
            const response = await apiClient.post('/auth/refresh', {}, { timeout: 5000 });
            const newAccessToken = response.data.data.access_token;
            setAccessToken(newAccessToken);
            processQueue(null, newAccessToken);
            originalRequest.headers!['Authorization'] = `Bearer ${newAccessToken}`;
            return apiClient(originalRequest);
        } catch (err) {
            processQueue(err, null);
            clearAccessToken();
            return Promise.reject(err);
        } finally {
            setRefreshing(false);
        }
    }
    return Promise.reject(error);
}

// Inject access token ke setiap request
apiClient.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) config.headers['Authorization'] = `Bearer ${token}`;
    return config;
});

// Refresh token jika 401
apiClient.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
        if (AUTO_REFRESH_TOKEN) {
            return autoRefresh(error);
        } else {
            if (error.status === 401) {
                clearAccessToken();
            }
            return Promise.reject(error);
        }
    }
);

export default apiClient;