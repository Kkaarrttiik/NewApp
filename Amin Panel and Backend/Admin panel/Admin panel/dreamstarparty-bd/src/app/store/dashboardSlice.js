import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "../../util/api";

export const fetchDashboardCards = createAsyncThunk(
  "dashboard/fetchCards",
  async ({ startDate, endDate } = {}, { rejectWithValue }) => {
    try {
      const res = await apiRequest("bd/dashboardCards", {
        params: {
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
        },
      });
      if (!res.status)
        return rejectWithValue(res.message || "Failed to load dashboard.");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchRevenueTrend = createAsyncThunk(
  "dashboard/fetchRevenueTrend",
  async ({ startDate, endDate } = {}, { rejectWithValue }) => {
    try {
      const res = await apiRequest("bd/revenueTrend", {
        params: {
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
        },
      });
      if (!res.status)
        return rejectWithValue(res.message || "Failed to load revenue trend.");
      return res.walletStats;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchTopAgencies = createAsyncThunk(
  "dashboard/fetchTopAgencies",
  async ({ startDate, endDate } = {}, { rejectWithValue }) => {
    try {
      const res = await apiRequest("bd/myAgencies", {
        params: {
          start: 1,
          limit: 5,
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
        },
      });
      if (!res.status)
        return rejectWithValue(res.message || "Failed to load top agencies.");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchTopHosts = createAsyncThunk(
  "dashboard/fetchTopHosts",
  async ({ startDate, endDate } = {}, { rejectWithValue }) => {
    try {
      const res = await apiRequest("bd/hostsUnderAgencies", {
        params: {
          start: 1,
          limit: 5,
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
        },
      });
      if (!res.status)
        return rejectWithValue(res.message || "Failed to load top hosts.");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    cards: null,
    loading: false,
    error: null,
    revenueTrend: [],
    trendLoading: false,
    topAgencies: [],
    topAgenciesLoading: false,
    topHosts: [],
    topHostsLoading: false,
  },
  reducers: {
    clearDashboard(state) {
      state.cards = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardCards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardCards.fulfilled, (state, action) => {
        state.loading = false;
        state.cards = action.payload;
      })
      .addCase(fetchDashboardCards.rejected, (state, action) => {
        state.loading = false;
        if (
          action.payload !== "Invalid BD ID" &&
          action.payload !== "BD ID is required"
        ) {
          state.error = action.payload;
        }
      })
      .addCase(fetchRevenueTrend.pending, (state) => {
        state.trendLoading = true;
      })
      .addCase(fetchRevenueTrend.fulfilled, (state, action) => {
        state.trendLoading = false;
        state.revenueTrend = action.payload;
      })
      .addCase(fetchRevenueTrend.rejected, (state) => {
        state.trendLoading = false;
      })
      .addCase(fetchTopAgencies.pending, (state) => {
        state.topAgenciesLoading = true;
      })
      .addCase(fetchTopAgencies.fulfilled, (state, action) => {
        state.topAgenciesLoading = false;
        state.topAgencies = action.payload;
      })
      .addCase(fetchTopAgencies.rejected, (state) => {
        state.topAgenciesLoading = false;
      })
      .addCase(fetchTopHosts.pending, (state) => {
        state.topHostsLoading = true;
      })
      .addCase(fetchTopHosts.fulfilled, (state, action) => {
        state.topHostsLoading = false;
        state.topHosts = action.payload;
      })
      .addCase(fetchTopHosts.rejected, (state) => {
        state.topHostsLoading = false;
      });
  },
});

export const { clearDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;
