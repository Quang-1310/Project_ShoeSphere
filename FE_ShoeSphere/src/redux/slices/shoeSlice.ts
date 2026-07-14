import type { ShoeResponseDTO, PageResponseDTO } from '../../pages/type';
import { getShoeDetailThunk, getShoesThunk } from '../../api/homeAPI';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Định nghĩa cấu trúc State của Shoe
interface ShoeState {
  shoesPage: PageResponseDTO<ShoeResponseDTO> | null;
  selectedShoe: ShoeResponseDTO | null;
  currentPage: number;
  filters: {
    name: string;
    brand: string;
    minPrice: string;
    maxPrice: string;
  };
  loading: boolean;
  error: string | null;
}

const initialState: ShoeState = {
  shoesPage: null,
  selectedShoe: null,
  currentPage: 1,
  filters: {
    name: null,       
    brand: null,      
    minPrice: null,   
    maxPrice: null,
  },
  loading: false,
  error: null,
};

const shoeSlice = createSlice({
  name: 'shoe',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<{ name: string; brand: string; minPrice: string; maxPrice: string }>) => {
      state.filters = action.payload;
      state.currentPage = 1; // Reset về trang 1 khi lọc mới
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    clearSelectedShoe: (state) => {
      state.selectedShoe = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Xử lý danh sách sản phẩm
      .addCase(getShoesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getShoesThunk.fulfilled, (state, action: PayloadAction<PageResponseDTO<ShoeResponseDTO>>) => {
        state.loading = false;
        state.shoesPage = action.payload;
      })
      .addCase(getShoesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Xử lý chi tiết sản phẩm
      .addCase(getShoeDetailThunk.fulfilled, (state, action: PayloadAction<ShoeResponseDTO>) => {
        state.selectedShoe = action.payload;
      })
      .addCase(getShoeDetailThunk.rejected, (_, action) => {
        alert(action.payload as string || "Không thể tải thông tin chi tiết sản phẩm!");
      });
  },
});

export const { setFilters, setCurrentPage, clearSelectedShoe } = shoeSlice.actions;
export default shoeSlice.reducer;