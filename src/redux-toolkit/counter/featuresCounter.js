import { createSlice } from "@reduxjs/toolkit";

export const featuresSlice = createSlice({
  name: "features",
  initialState: {
    table: {
      page: 1,
      limit: 10,
      search: "",
      searchBy: null,
    },
  },
  reducers: {
    // table
    setPage: (state, action) => {
      state.table.page = action.payload;
    },
    setLimit: (state, action) => {
      state.table.limit = action.payload;
    },
    setSearch: (state, action) => {
      state.table.search = action.payload;
    },
    setSearchBy: (state, action) => {
      state.table.searchBy = action.payload;
    },
  },
});

export const { setPage, setLimit, setSearch, setSearchBy } =
  featuresSlice.actions;

export default featuresSlice.reducer;
