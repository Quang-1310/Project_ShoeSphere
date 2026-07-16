import { configureStore } from "@reduxjs/toolkit";
import registerSlice from "../slices/registerSlice";
import loginSlice from "../slices/loginSlice";
import shoeSlice from "../slices/shoeSlice";
import adminShoeSlice from '../slices/adminShoeSlice';
import authSlice from "../slices/authSlice";
import adminUserSlice from '../slices/adminUserSlice';
import adminOrderSlice from '../slices/adminOrderSlice';

export const store = configureStore({
    reducer: {
        registerSlice: registerSlice,
        loginSlice: loginSlice,
        shoeSlice: shoeSlice,
        adminShoeSlice: adminShoeSlice,
        authSlice: authSlice,
        adminUserSlice: adminUserSlice,
        adminOrderSlice: adminOrderSlice
    }
})

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
