import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "../../util/api";

const LIMIT = 10;

// ✅ Now accepts { page, type } instead of just page
export const fetchTransactions = createAsyncThunk(
  "transactions/fetch",
  async ({ page = 1, type = null } = {}, { rejectWithValue }) => {
    try {
      const res = await apiRequest("bdRedeem/getWalletTransactionOfBD", {
        params: {
          start: page,
          limit: LIMIT,
          ...(type && { type }), // only send if a type is selected
        },
      });
      if (!res.status)
        return rejectWithValue(res.message || "Failed to load transactions.");
      return { data: res.data, total: res.total, page };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const transactionSlice = createSlice({
  name: "transactions",
  initialState: {
    list: [],
    total: 0,
    currentPage: 1,
    loading: false,
    error: null,
  },
  reducers: {
    setTransactionPage(state, action) {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
        state.total = action.payload.total;
        state.currentPage = action.payload.page;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setTransactionPage } = transactionSlice.actions;
export default transactionSlice.reducer;
