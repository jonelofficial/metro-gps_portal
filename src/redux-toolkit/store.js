import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import tokenReducer from "./counter/userCounter";
import sidebarReducer from "./counter/sidebarCounter";
import featuresReducer from "./counter/featuresCounter";
import { metroApi } from "../api/metroApi";

export const store = configureStore({
  reducer: {
    token: tokenReducer,
    sidebar: sidebarReducer,
    features: featuresReducer,
    [metroApi.reducerPath]: metroApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(metroApi.middleware),
});
