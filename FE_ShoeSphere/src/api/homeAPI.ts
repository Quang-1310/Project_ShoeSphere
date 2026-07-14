import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchShoes, fetchShoeDetail } from '../api/shoeAPI';
import type { ShoeResponseDTO, PageResponseDTO } from '../pages/type';

// Định nghĩa cấu trúc State của Shoe
interface ShoeState {
  shoesPage: PageResponseDTO<ShoeResponseDTO> | null;
  selectedShoe: ShoeResponseDTO | null;
  currentPage: number;
  filters: {
    name: string | null;
    brand: string | null;
    minPrice: string | null;
    maxPrice: string | null;
  };
  loading: boolean;
  error: string | null;
}

// Async Thunk để gọi API lấy danh sách sản phẩm có phân trang & bộ lọc
export const getShoesThunk = createAsyncThunk(
  'shoe/getShoes',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { shoeSlice: ShoeState };
      const { filters, currentPage } = state.shoeSlice;
      
      // Hàm fetchShoes bây giờ trả thẳng về PageResponseDTO nên ta return trực tiếp luôn
      const data = await fetchShoes(filters, currentPage, 9);
      return data; 
    } catch (err) {
      return rejectWithValue(err.message || 'Lỗi kết nối server');
    }
  }
);

// Async Thunk để gọi API lấy chi tiết sản phẩm theo ID
export const getShoeDetailThunk = createAsyncThunk(
  'shoe/getShoeDetail',
  async (id: number, { rejectWithValue }) => {
    try {
      // Hàm fetchShoeDetail bây giờ trả thẳng về ShoeResponseDTO
      const data = await fetchShoeDetail(id);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Lỗi tải chi tiết sản phẩm');
    }
  }
);