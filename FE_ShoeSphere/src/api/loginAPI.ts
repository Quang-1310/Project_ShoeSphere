import { createAsyncThunk } from "@reduxjs/toolkit";
import configAPI from "./configAPI";
import type { ApiDataResponse, UserResponseDTO } from "../pages/type";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponseData {
  accessToken: string;
  refreshToken: string;
}

export const logoutUserSession = async () => {
  const refreshToken = localStorage.getItem('refreshToken');

  if (refreshToken) {
    await configAPI.post('/auth/logout', { refreshToken });
  }
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (loginData: LoginRequest, { rejectWithValue }) => {
    try {
      const res = await configAPI.post<ApiDataResponse<AuthResponseData>>('/auth/login', loginData);
      
      if (res.data.data) {
        localStorage.setItem('accessToken', res.data.data.accessToken);
        localStorage.setItem('refreshToken', res.data.data.refreshToken);
      }
      
      return res.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Đăng nhập hệ thống thất bại!';
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchProfileMe = createAsyncThunk(
  'auth/fetchProfileMe',
  async (_, { rejectWithValue }) => {
    try {
      // Đảm bảo axios interceptor của bạn đã tự động đính kèm Bearer Token vào header rồi nhé
      const res = await configAPI.get<ApiDataResponse<UserResponseDTO>>('/auth/me');
      return res.data.data; // Trả về thông tin UserResponseDTO dạng object sạch
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Không thể lấy thông tin tài khoản!');
    }
  }
);
