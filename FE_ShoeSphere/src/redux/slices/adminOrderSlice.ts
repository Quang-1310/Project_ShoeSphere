import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { getAdminOrdersThunk, confirmAdminOrderThunk, type OrderResponseDTO } from '../../api/adminOrderAPI';

interface AdminOrderState {
  orders: OrderResponseDTO[];
  currentPage: number;
  totalPages: number;
  searchTerm: string; // Used for orderId search
  selectedStatus: string;
  loading: boolean;
  error: string | null;
}

const initialState: AdminOrderState = {
  orders: [],
  currentPage: 1,
  totalPages: 1,
  searchTerm: '',
  selectedStatus: '',
  loading: false,
  error: null,
};

const adminOrderSlice = createSlice({
  name: 'adminOrder',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.currentPage = 1;
    },
    setSelectedStatus: (state, action: PayloadAction<string>) => {
      state.selectedStatus = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Orders
      .addCase(getAdminOrdersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminOrdersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.content;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(getAdminOrdersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Confirm Order
      .addCase(confirmAdminOrderThunk.fulfilled, (state, action) => {
        const updatedOrder = action.payload;
        const index = state.orders.findIndex(o => o.id === updatedOrder.id);
        if (index !== -1) {
          state.orders[index] = updatedOrder;
        }
      });
  }
});

export const { setSearchTerm, setSelectedStatus, setCurrentPage } = adminOrderSlice.actions;
export default adminOrderSlice.reducer;
