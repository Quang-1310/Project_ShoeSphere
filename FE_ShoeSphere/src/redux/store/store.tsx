import { configureStore } from "@reduxjs/toolkit";
import registerSlice from "../slices/registerSlice";
import loginSlice from "../slices/loginSlice";
import shoeSlice from "../slices/shoeSlice";

export const store = configureStore({
    reducer: {
        registerSlice: registerSlice,
        loginSlice: loginSlice,
        shoeSlice: shoeSlice,
    }
})

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;