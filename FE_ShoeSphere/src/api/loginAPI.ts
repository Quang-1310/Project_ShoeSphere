import { createAsyncThunk } from "@reduxjs/toolkit";
import configAPI from "./configAPI";
import type { ApiDataResponse } from "../pages/type";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponseData {
  accessToken: string;
  refreshToken: string;
}

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