import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../app/store";
import { LocationType } from "./navigationTypes";

interface NavigationState {
  location: LocationType;
  history: Array<LocationType>;
}

const initialState: NavigationState = {
  location: "lists",
  history: [],
};

export const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    goTo: (state, action: PayloadAction<LocationType>) => {
      state.location = action.payload;
      state.history.push(action.payload);
    },
  },
});

export const selectLocation = (state: RootState): LocationType => {
  return state.navigation.location;
};

export const { goTo } = navigationSlice.actions;

export default navigationSlice.reducer;
