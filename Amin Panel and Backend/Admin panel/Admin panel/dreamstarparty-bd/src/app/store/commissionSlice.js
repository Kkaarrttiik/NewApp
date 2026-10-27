import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "../../util/api";

export const fetchCommissionOverview = createAsyncThunk(
  "commission/fetchOverview",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiRequest("bd/commissionOverview");
      if (!res.status) {
        return rejectWithValue(
          res.message || "Failed to load commission data.",
        );
      }
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const LIMIT = 10;
export const fetchCommissionBreakdown = createAsyncThunk(
  "commission/fetchBreakdown",
  async (page = 1, { rejectWithValue }) => {
    try {
      const start = page;

      const res = await apiRequest("bd/commissionBreakdown", {
        params: { start, limit: LIMIT },
      });
      if (!res.status) {
        return rejectWithValue(res.message || "Failed to load breakdown.");
      }
      return { data: res.data, total: res.total };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const commissionSlice = createSlice({
  name: "commission",
  initialState: {
    cards: null,
    trend: [],
    breakdown: [],
    breakdownTotal: 0,
    breakdownPage: 1,
    breakdownLoading: false,
    loading: false,
    error: null,
  },
  reducers: {
    clearCommission(state) {
      state.cards = null;
      state.trend = [];
      state.loading = false;
      state.error = null;
    },
    setBreakdownPage(state, action) {
      state.breakdownPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommissionOverview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommissionOverview.fulfilled, (state, action) => {
        state.loading = false;
        state.cards = action.payload.cards;
        state.trend = action.payload.trend;
      })
      .addCase(fetchCommissionOverview.rejected, (state, action) => {
        state.loading = false;
        if (
          action.payload !== "Invalid BD ID" &&
          action.payload !== "BD ID is required"
        ) {
          state.error = action.payload;
        }
      })
      .addCase(fetchCommissionBreakdown.pending, (state) => {
        state.breakdownLoading = true;
      })
      .addCase(fetchCommissionBreakdown.fulfilled, (state, action) => {
        state.breakdownLoading = false;
        state.breakdown = action.payload.data;
        state.breakdownTotal = action.payload.total;
      })
      .addCase(fetchCommissionBreakdown.rejected, (state) => {
        state.breakdownLoading = false;
      });
  },
});

export const { clearCommission, setBreakdownPage } = commissionSlice.actions;
export default commissionSlice.reducer;
