import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        user: null,
        token: null,
        isAuthenticated: false
    },
    reducers: {
        loginUser: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            localStorage.setItem('token', action.payload.token);

        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');

        },
        loadTokenFromStorage: (state) => {
            const token = localStorage.getItem('token');
            if (token) {
                state.token = token;
            }
        }
    },
});

export const { loginUser, logout, loadTokenFromStorage } = userSlice.actions;
export default userSlice.reducer;