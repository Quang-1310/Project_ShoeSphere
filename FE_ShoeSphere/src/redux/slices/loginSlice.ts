import { createSlice } from "@reduxjs/toolkit";
import { loginUser, type AuthResponseData } from "../../api/loginAPI";

interface LoginState {
  status: 'idle' | 'loading' | 'fulfilled' | 'rejected';
  successMessage: string | null;
  error: string | undefined;
  tokenData: AuthResponseData | null;
}

const initialState: LoginState = {
  status: 'idle',
  successMessage: null,
  error: undefined,
  tokenData: null,
};

const loginSlice = createSlice({
  name: 'loginSlice',
  initialState,
  reducers: {
    resetLoginState: (state) => {
      state.status = 'idle';
      state.successMessage = null;
      state.error = undefined;
    },
    logoutUser: (state) => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      state.tokenData = null;
      state.status = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'fulfilled';
        state.successMessage = action.payload.message;
        state.tokenData = action.payload.data;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'rejected';
        state.error = action.payload as string;
      });
  },
});

export const { resetLoginState, logoutUser } = loginSlice.actions;
export default loginSlice.reducer;