import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CSSProperties } from "react";
import { RootState } from "../../../app/store";

interface SettingsState {
  keyboardHeight: number;
  relativeToKeyboardStyle?: CSSProperties;
}

const initialState: SettingsState = {
  keyboardHeight: 0,
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    updateKeyboardHeight: (state, action: PayloadAction<number>) => {
      state.keyboardHeight = action.payload;
    },
    updateRelativeToKeyboardStyle: (
      state,
      action: PayloadAction<CSSProperties | undefined>
    ) => {
      state.relativeToKeyboardStyle = action.payload;
    },
  },
});

export const selectKeyboardHeight = (state: RootState): number => {
  return state.settings.keyboardHeight;
};

export const selectRelativeToKeyboardStyle = (
  state: RootState
): CSSProperties | undefined => {
  return state.settings.relativeToKeyboardStyle;
};

export const { updateKeyboardHeight, updateRelativeToKeyboardStyle } =
  settingsSlice.actions;

export default settingsSlice.reducer;
