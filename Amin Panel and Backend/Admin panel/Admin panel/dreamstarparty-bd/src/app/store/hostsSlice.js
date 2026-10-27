import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "../../util/api";

const LIMIT = 10;

// ✅ Accept startDate/endDate directly as filters — no more getState().bd
export const fetchHosts = createAsyncThunk(
  "hosts/fetchHosts",
  async (filters, { rejectWithValue }) => {
    try {
      const page = filters?.page || 1;

      const res = await apiRequest("bd/hostsUnderAgencies", {
        params: {
          start: page,
          limit: LIMIT,
          ...(filters?.search && { search: filters.search }),
          ...(filters?.status &&
            filters.status !== "All" && {
              status: filters.status.toLowerCase(),
            }),
          ...(filters?.startDate && { startDate: filters.startDate }),
          ...(filters?.endDate && { endDate: filters.endDate }),
        },
      });

      if (!res.status)
        return rejectWithValue(res.message || "Failed to load hosts.");
      return { data: res.data, total: res.total };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const hostsSlice = createSlice({
  name: "hosts",
  initialState: {
    list: [],
    total: 0,
    currentPage: 1,
    loading: false,
    error: null,
  },
  reducers: {
    setHostsPage(state, action) {
      state.currentPage = action.payload;
    },
    clearHosts(state) {
      state.list = [];
      state.total = 0;
      state.currentPage = 1;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHosts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchHosts.rejected, (state, action) => {
        state.loading = false;
        if (
          action.payload !== "Invalid BD ID" &&
          action.payload !== "BD ID is required"
        ) {
          state.error = action.payload;
        }
      });
  },
});

export const { setHostsPage, clearHosts } = hostsSlice.actions;
export default hostsSlice.reducer;
