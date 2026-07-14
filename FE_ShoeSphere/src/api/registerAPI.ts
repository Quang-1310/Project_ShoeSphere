import type { ApiDataResponse } from '../pages/type';
import configAPI from './configAPI';
import { createAsyncThunk } from '@reduxjs/toolkit';

export interface RegisterRequest {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}


export const addUser = createAsyncThunk(
    "users/register",
    async (registerData: RegisterRequest, { rejectWithValue }) => {
        try {
            const res = await configAPI.post<ApiDataResponse<void>>("/auth/register", registerData);
            return res.data
        } catch (error) {
      const errorMsg = error.response?.data?.message || "Đăng ký tài khoản thất bại!";
      return rejectWithValue(errorMsg);
            
        }
    }
)

