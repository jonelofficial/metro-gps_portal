import { createSlice } from "@reduxjs/toolkit";

export const drawerSlice = createSlice({
  name: "drawer",
  initialState: {
    value: false,
    drawerState: {},
  },
  reducers: {
    onClose: (state, action) => {
      state.value = false;
    },
    onToggle: (state, action) => {
      state.value = !state.value;
    },
    setDrawerState: (state, action) => {
      state.drawerState = action.payload;
    },
    clearDrawerState: (state, action) => {
      state.drawerState = {};
    },
  },
});

export const { onClose, onToggle, setDrawerState, clearDrawerState } =
  drawerSlice.actions;

export default drawerSlice.reducer;
