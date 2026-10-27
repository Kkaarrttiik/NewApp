import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "../../util/api";

export const fetchBdProfile = createAsyncThunk(
  "profile/fetchBdProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiRequest(`bd/profile`);
      if (!res.status)
        return rejectWithValue(res.message || "Failed to load profile.");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const profileSlice = createSlice({
  name: "profile",
  initialState: { data: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBdProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBdProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchBdProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default profileSlice.reducer;
