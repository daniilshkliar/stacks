import { configureStore } from "@reduxjs/toolkit";
import settingsReducer from "../features/settings/model/settingsSlice";
import listReducer from "../features/lists/model/listSlice";

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    lists: listReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
