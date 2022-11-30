import { configureStore } from "@reduxjs/toolkit";
import tokenReducer from "./counter/userCounter";
import sidebarReducer from "./counter/sidebarCounter";

export const store = configureStore({
  reducer: {
    token: tokenReducer,
    sidebar: sidebarReducer,
  },
});
