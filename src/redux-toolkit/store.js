import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import tokenReducer from "./counter/userCounter";
import sidebarReducer from "./counter/sidebarCounter";
import featuresReducer from "./counter/featuresCounter";
import { metroApi } from "../api/metroApi";
import { sedarApi } from "../api/sedarApi";

export const store = configureStore({
  reducer: {
    token: tokenReducer,
    sidebar: sidebarReducer,
    features: featuresReducer,
    [metroApi.reducerPath]: metroApi.reducer,
    [sedarApi.reducerPath]: sedarApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(metroApi.middleware, sedarApi.middleware),
});
