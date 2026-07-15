import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import configAPI from './configAPI';
import type { ApiDataResponse, PageResponseDTO, UserResponseDTO } from '../pages/type';

const getErrorMessage = (error: unknown, fallback: string) =>
  axios.isAxiosError(error) ? error.response?.data?.message || fallback : fallback;

export const getAdminUsersThunk = createAsyncThunk(
  'adminUser/fetchAll',
  async (params: { page: number; size: number; email?: string }, { rejectWithValue }) => {
    try {
      const response = await configAPI.get<ApiDataResponse<PageResponseDTO<UserResponseDTO>>>('/admin/users', { params });
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message || 'Không thể tải danh sách tài khoản.');
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Lỗi kết nối máy chủ.'));
    }
  }
);

export const toggleAdminUserStatusThunk = createAsyncThunk(
  'adminUser/toggleStatus',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await configAPI.patch<ApiDataResponse<UserResponseDTO>>(`/admin/users/${id}/status`);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message || 'Không thể cập nhật trạng thái tài khoản.');
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Không thể cập nhật trạng thái tài khoản.'));
    }
  }
);

export const deleteAdminUserThunk = createAsyncThunk(
  'adminUser/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await configAPI.delete<ApiDataResponse<void>>(`/admin/users/${id}`);
      if (response.data.success) {
        return id;
      }
      return rejectWithValue(response.data.message || 'Không thể xóa tài khoản.');
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Không thể xóa tài khoản.'));
    }
  }
);
