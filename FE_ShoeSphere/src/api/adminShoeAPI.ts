import { createAsyncThunk } from '@reduxjs/toolkit';
import configAPI from './configAPI';

// AsyncThunk: Lấy danh sách sản phẩm phân trang dành cho Admin
export const getAdminShoesThunk = createAsyncThunk(
  'adminShoe/fetchAll',
  async (params: { page: number; size: number; name?: string }, { rejectWithValue }) => {
    try {
      const response = await configAPI.get('/admin/shoes', { params });
      if (response.data?.success) {
        return response.data.data; // Trả về đối tượng PageResponseDTO
      }
      return rejectWithValue(response.data?.message || 'Có lỗi xảy ra');
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi kết nối Server');
    }
  }
);

// AsyncThunk: Thêm mới sản phẩm (Nhận vào FormData chứa tệp tin nhị phân)
export const createAdminShoeThunk = createAsyncThunk(
  'adminShoe/create',
  async (multipartData: FormData, { rejectWithValue }) => {
    try {
      const response = await configAPI.post('/admin/shoes', multipartData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Thêm mới thất bại');
    }
  }
);

// AsyncThunk: Cập nhật sản phẩm (Nhận vào đối tượng chứa id và FormData)
export const updateAdminShoeThunk = createAsyncThunk(
  'adminShoe/update',
  async ({ id, multipartData }: { id: number; multipartData: FormData }, { rejectWithValue }) => {
    try {
      const response = await configAPI.put(`/admin/shoes/${id}`, multipartData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Cập nhật thất bại');
    }
  }
);

// AsyncThunk: Xóa mềm sản phẩm
export const deleteAdminShoeThunk = createAsyncThunk(
  'adminShoe/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await configAPI.delete(`/admin/shoes/${id}`);
      if (response.data?.success) {
        return id; // Trả về ID đã xóa để Slice cập nhật UI cục bộ
      }
      return rejectWithValue(response.data?.message);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Xóa thất bại');
    }
  }
);