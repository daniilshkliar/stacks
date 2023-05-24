import { configureStore } from "@reduxjs/toolkit";
import navigationReducer from "../features/navigation/model/navigationSlice";
import listReducer from "../features/lists/model/listSlice";

export const store = configureStore({
  reducer: {
    navigation: navigationReducer,
    lists: listReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
