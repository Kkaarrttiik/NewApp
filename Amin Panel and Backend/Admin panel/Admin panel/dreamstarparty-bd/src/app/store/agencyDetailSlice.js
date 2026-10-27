import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "../../util/api";

export const fetchAgencyDetail = createAsyncThunk(
  "agencyDetail/fetch",
  async ({ agencyId, startDate, endDate } = {}, { rejectWithValue }) => {
    try {
      const res = await apiRequest("bd/agencyDetail", {
        params: {
          agencyId,
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
        },
      });
      if (!res.status)
        return rejectWithValue(res.message || "Failed to load agency detail.");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchAgencyHosts = createAsyncThunk(
  "agencyDetail/fetchHosts",
  async ({ agencyId, startDate, endDate } = {}, { rejectWithValue }) => {
    try {
      const res = await apiRequest("bd/hostsUnderAgencies", {
        params: {
          agencyId,
          start: 1,
          limit: 3,
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
        },
      });
      if (!res.status)
        return rejectWithValue(res.message || "Failed to load hosts.");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchAgencyCharts = createAsyncThunk(
  "agencyDetail/fetchCharts",
  async ({ agencyId, startDate, endDate } = {}, { rejectWithValue }) => {
    try {
      const res = await apiRequest("bd/agencyCharts", {
        params: {
          agencyId,
          startDate: startDate || "all",
          endDate: endDate || "all",
        },
      });
      if (!res.status)
        return rejectWithValue(res.message || "Failed to load charts.");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const agencyDetailSlice = createSlice({
  name: "agencyDetail",
  initialState: {
    agency: null,
    cards: null,
    loading: false,
    error: null,
    hosts: [],
    hostsLoading: false,
    charts: null,
    chartsLoading: false,
  },
  reducers: {
    clearAgencyDetail(state) {
      state.agency = null;
      state.cards = null;
      state.hosts = [];
      state.hostsLoading = false;
      state.loading = false;
      state.error = null;
      state.charts = null;
      state.chartsLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAgencyDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgencyDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.agency = action.payload.agency;
        state.cards = action.payload.cards;
      })
      .addCase(fetchAgencyDetail.rejected, (state, action) => {
        state.loading = false;
        if (
          action.payload !== "Invalid BD ID" &&
          action.payload !== "BD ID is required"
        ) {
          state.error = action.payload;
        }
      })
      .addCase(fetchAgencyHosts.pending, (state) => {
        state.hostsLoading = true;
      })
      .addCase(fetchAgencyHosts.fulfilled, (state, action) => {
        state.hostsLoading = false;
        state.hosts = action.payload;
      })
      .addCase(fetchAgencyHosts.rejected, (state) => {
        state.hostsLoading = false;
      })
      .addCase(fetchAgencyCharts.pending, (state) => {
        state.chartsLoading = true;
      })
      .addCase(fetchAgencyCharts.fulfilled, (state, action) => {
        state.chartsLoading = false;
        state.charts = action.payload;
      })
      .addCase(fetchAgencyCharts.rejected, (state) => {
        state.chartsLoading = false;
      });
  },
});

export const { clearAgencyDetail } = agencyDetailSlice.actions;
export default agencyDetailSlice.reducer;
