import { createSlice } from "@reduxjs/toolkit";

export const sidebarSlice = createSlice({
  name: "sidebar",
  initialState: {
    value: false,
  },
  reducers: {
    openSidebar: (state) => {
      state.value = true;
    },
    closeSidebar: (state) => {
      state.value = false;
    },
  },
});

export const { openSidebar, closeSidebar } = sidebarSlice.actions;

export default sidebarSlice.reducer;
