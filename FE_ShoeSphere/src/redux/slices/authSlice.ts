import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { fetchProfileMe} from '../../api/loginAPI';
import type { UserResponseDTO } from '../../pages/type';

interface AuthState {
  user: UserResponseDTO | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      state.user = null;
      state.error = null;
      state.loading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfileMe.fulfilled, (state, action: PayloadAction<UserResponseDTO>) => {
        state.loading = false;
        state.user = action.payload; // Lưu thông tin người dùng chứa roles rõ ràng
      })
      .addCase(fetchProfileMe.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.payload as string;
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
