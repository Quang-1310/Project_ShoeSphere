import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { getAdminShoesThunk, deleteAdminShoeThunk } from '../../api/adminShoeAPI';

import type { ShoeResponseDTO, PageResponseDTO } from '../../pages/type';

interface AdminShoeState {
  shoes: ShoeResponseDTO[];
  currentPage: number;
  totalPages: number;
  searchTerm: string;
  loading: boolean;
  error: string | null;
}

const initialState: AdminShoeState = {
  shoes: [],
  currentPage: 1,
  totalPages: 1,
  searchTerm: '',
  loading: false,
  error: null,
};

const adminShoeSlice = createSlice({
  name: 'adminShoe',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.currentPage = 1; // Reset về trang đầu khi tìm kiếm mới
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Xử lý lấy danh sách
      .addCase(getAdminShoesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminShoesThunk.fulfilled, (state, action: PayloadAction<PageResponseDTO<ShoeResponseDTO>>) => {
        state.loading = false;
        state.shoes = action.payload.content;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(getAdminShoesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Xử lý xóa mềm thành công (Cập nhật trực tiếp State UI)
      .addCase(deleteAdminShoeThunk.fulfilled, (state, action: PayloadAction<number>) => {
        state.shoes = state.shoes.filter(shoe => shoe.id !== action.payload);
      });
  }
});

export const { setSearchTerm, setCurrentPage } = adminShoeSlice.actions;
export default adminShoeSlice.reducer;