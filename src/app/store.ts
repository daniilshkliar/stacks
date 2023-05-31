import { configureStore } from "@reduxjs/toolkit";
import settingsReducer from "../features/settings/model/settingsSlice";
import navigationReducer from "../features/navigation/model/navigationSlice";
import listReducer from "../features/lists/model/listSlice";

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    navigation: navigationReducer,
    lists: listReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
