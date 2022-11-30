import { createSlice } from "@reduxjs/toolkit";

export const tokenSlice = createSlice({
  name: "token",
  initialState: {
    value: localStorage.getItem("token"),
    userDetails: JSON.parse(localStorage.getItem("user")),
  },
  reducers: {
    removeToken: (state) => {
      state.value = null;
    },
    addToken: (state, action) => {
      state.value = action.payload.token;
    },
    addUser: (state, action) => {
      state.userDetails = action.payload;
    },
    removeUser: (state) => {
      state.userDetails = {};
    },
  },
});

export const { removeToken, addToken, addUser, removeUser } =
  tokenSlice.actions;

export default tokenSlice.reducer;
