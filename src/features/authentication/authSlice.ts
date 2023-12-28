import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import User from "../../models/User";
import { RootState } from "../../app/store";

export interface AuthState {
    accessToken: string | null | undefined,
    user: User | null
}

const initialState: AuthState = {
    accessToken: null,
    user: null
}


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<AuthState>) => {
            state.accessToken = action.payload.accessToken;
            state.user = action.payload.user;
        },
        accessTokenChanged: (state, action: PayloadAction<string>) => {
            state.accessToken = action.payload;
        },
        logout: (state) => {
            state.accessToken = null;
            state.user = null;
        }
    }
});


export const selectAccessToken = (state: RootState) => state.authReducer.accessToken;
export const selectUser = (state: RootState) => state.authReducer.user;

export const {
    login,
    logout,
    accessTokenChanged
} = authSlice.actions

export default authSlice.reducer