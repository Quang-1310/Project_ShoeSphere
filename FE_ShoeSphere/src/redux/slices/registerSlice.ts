import { createSlice} from '@reduxjs/toolkit';

import { addUser } from '../../api/registerAPI';


interface userRegisterState {
  status: "idle" | "pending" | "fulfilled" | "rejected";
  successMessage: string | null;
  error: undefined | string;
}

const initialState: userRegisterState = {
  status: "idle",
  successMessage: null,
  error: undefined
};


const registerSlice = createSlice({
    name: "registerSlice",
    initialState,
    reducers: {
        resetRegisterState: (state) => {
      state.status = "idle";
      state.successMessage = null;
      state.error = undefined;
    }},
    extraReducers(builder) {
    builder
      .addCase(addUser.pending, (state) => {
        state.status = "pending";
        state.successMessage = null;
        state.error = undefined;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.status = "fulfilled"; 
        state.successMessage = action.payload.message; 
      })
      .addCase(addUser.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload as string; 
      });
  },
})

export const { resetRegisterState } = registerSlice.actions;
export default registerSlice.reducer
