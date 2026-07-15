import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { PageResponseDTO, UserResponseDTO } from '../../pages/type';
import { deleteAdminUserThunk, getAdminUsersThunk, toggleAdminUserStatusThunk } from '../../api/adminUserAPI';

interface AdminUserState {
  users: UserResponseDTO[];
  currentPage: number;
  totalPages: number;
  searchTerm: string;
  loading: boolean;
  error: string | null;
}

const initialState: AdminUserState = {
  users: [],
  currentPage: 1,
  totalPages: 1,
  searchTerm: '',
  loading: false,
  error: null,
};

const adminUserSlice = createSlice({
  name: 'adminUser',
  initialState,
  reducers: {
    setAdminUserSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.currentPage = 1;
    },
    setAdminUserCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAdminUsersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminUsersThunk.fulfilled, (state, action: PayloadAction<PageResponseDTO<UserResponseDTO>>) => {
        state.loading = false;
        state.users = action.payload.content;
        state.totalPages = Math.max(action.payload.totalPages, 1);
      })
      .addCase(getAdminUsersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(toggleAdminUserStatusThunk.fulfilled, (state, action: PayloadAction<UserResponseDTO>) => {
        state.users = state.users.map((user) => user.id === action.payload.id ? action.payload : user);
      })
      .addCase(deleteAdminUserThunk.fulfilled, (state, action: PayloadAction<number>) => {
        state.users = state.users.filter((user) => user.id !== action.payload);
      });
  },
});

export const { setAdminUserSearchTerm, setAdminUserCurrentPage } = adminUserSlice.actions;
export default adminUserSlice.reducer;
