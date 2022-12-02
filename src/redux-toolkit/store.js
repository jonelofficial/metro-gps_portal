import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import tokenReducer from "./counter/userCounter";
import sidebarReducer from "./counter/sidebarCounter";
import { metroApi } from "../api/metroApi";

export const store = configureStore({
  reducer: {
    token: tokenReducer,
    sidebar: sidebarReducer,
    [metroApi.reducerPath]: metroApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(metroApi.middleware),
});
