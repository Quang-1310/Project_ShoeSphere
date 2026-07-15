import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

interface AuthResponseData {
  accessToken: string;
  refreshToken: string;
}

interface ApiDataResponse<T> {
  data: T;
}

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const API_BASE_URL = "http://localhost:8080/api/v1";

const configAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Client tách biệt để request refresh không đi qua interceptor của configAPI.
const refreshAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshTokenPromise: Promise<string> | null = null;

const clearAuthAndRedirectToLogin = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");

  if (window.location.pathname !== "/login") {
    window.location.assign("/login");
  }
};

const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    throw new Error("Không tìm thấy refresh token.");
  }

  const response = await refreshAPI.post<ApiDataResponse<AuthResponseData>>(
    "/auth/refresh",
    { refreshToken }
  );
  const tokenData = response.data.data;

  localStorage.setItem("accessToken", tokenData.accessToken);
  localStorage.setItem("refreshToken", tokenData.refreshToken);

  return tokenData.accessToken;
};

configAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

configAPI.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const status = error.response?.status;
    const requestUrl = originalRequest?.url ?? "";
    const isPublicAuthRequest = ["/auth/login", "/auth/register", "/auth/refresh"].some(
      (path) => requestUrl.includes(path)
    );

    // Chỉ refresh khi access token hết hạn (401), không refresh các request đăng nhập/đăng ký
    // và không lặp vô hạn nếu request đã được thử lại một lần.
    if (status !== 401 || !originalRequest || originalRequest._retry || isPublicAuthRequest) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      refreshTokenPromise ??= refreshAccessToken();
      const newAccessToken = await refreshTokenPromise;

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return configAPI(originalRequest);
    } catch (refreshError) {
      clearAuthAndRedirectToLogin();
      return Promise.reject(refreshError);
    } finally {
      refreshTokenPromise = null;
    }
  }
);

export default configAPI;
