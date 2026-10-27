import { createSlice } from "@reduxjs/toolkit";

const persistedBdId = localStorage.getItem("bdId");

const bdSlice = createSlice({
  name: "bd",
  initialState: {
    bdId: persistedBdId || null,
    isValid: null,
    error: null,
  },
  reducers: {
    setBdId(state, action) {
      state.bdId = action.payload;
      localStorage.setItem("bdId", action.payload);
    },
    setBdValid(state) {
      state.isValid = true;
      state.error = null;
    },
    setBdInvalid(state, action) {
      state.isValid = false;
      state.error = action.payload;
    },
    resetBd(state) {
      state.bdId = null;
      state.isValid = null;
      state.error = null;
      localStorage.removeItem("bdId");
    },
  },
});

export const { setBdId, setBdValid, setBdInvalid, resetBd, setDateRange } =
  bdSlice.actions;
export default bdSlice.reducer;
