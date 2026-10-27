import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "../../util/api";

const LIMIT = 10;

export const fetchWithdrawPage = createAsyncThunk(
  "withdraw/fetchPage",
  async (page = 1, { rejectWithValue }) => {
    try {
      const res = await apiRequest("bdRedeem/withdrawPage", {
        params: { start: page, limit: LIMIT },
      });
      if (!res.status) {
        return rejectWithValue(res.message || "Failed to load withdraw data.");
      }
      return { ...res.data, page };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const submitWithdrawRequest = createAsyncThunk(
  "withdraw/submit",
  async (
    { coin, description, paymentGateway, paymentDetails },
    { rejectWithValue, getState },
  ) => {
    try {
      const bdId = getState().bd.bdId || localStorage.getItem("bdId");
      const res = await apiRequest("bdRedeem/store", {
        method: "POST",
        data: { bdId, coin, description, paymentGateway, paymentDetails },
      });
      if (!res.status) {
        return rejectWithValue(res.message || "Failed to submit request.");
      }
      return res;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchPaymentMethods = createAsyncThunk(
  "withdraw/fetchPaymentMethods",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiRequest("bdPaymentMethod/fetchBDPaymentMethods");
      if (!res.status) {
        return rejectWithValue(
          res.message || "Failed to load payment methods.",
        );
      }
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchBdSetting = createAsyncThunk(
  "withdraw/fetchBdSetting",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiRequest("bd/getBdSetting");
      if (!res.status) return rejectWithValue(res.message);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const withdrawSlice = createSlice({
  name: "withdraw",
  initialState: {
    cards: null,
    history: [],
    total: 0,
    currentPage: 1,
    loading: false,
    submitting: false,
    error: null,
    submitError: null,
    submitSuccess: false,
    paymentMethods: [],
    paymentMethodsLoading: false,
    bdSetting: null,
    bdSettingLoading: false,
  },
  reducers: {
    setWithdrawPage(state, action) {
      state.currentPage = action.payload;
    },
    clearSubmitStatus(state) {
      state.submitError = null;
      state.submitSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWithdrawPage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWithdrawPage.fulfilled, (state, action) => {
        state.loading = false;
        state.cards = action.payload.cards;
        state.history = action.payload.history;
        state.total = action.payload.total;
        state.currentPage = action.payload.page;
      })
      .addCase(fetchWithdrawPage.rejected, (state, action) => {
        state.loading = false;
        if (
          action.payload !== "Invalid BD ID" &&
          action.payload !== "BD ID is required"
        ) {
          state.error = action.payload;
        }
      })
      .addCase(submitWithdrawRequest.pending, (state) => {
        state.submitting = true;
        state.submitError = null;
        state.submitSuccess = false;
      })
      .addCase(submitWithdrawRequest.fulfilled, (state) => {
        state.submitting = false;
        state.submitSuccess = true;
      })
      .addCase(submitWithdrawRequest.rejected, (state, action) => {
        state.submitting = false;
        state.submitError = action.payload;
      })
      .addCase(fetchPaymentMethods.pending, (state) => {
        state.paymentMethodsLoading = true;
      })
      .addCase(fetchPaymentMethods.fulfilled, (state, action) => {
        state.paymentMethodsLoading = false;
        state.paymentMethods = action.payload;
      })
      .addCase(fetchPaymentMethods.rejected, (state) => {
        state.paymentMethodsLoading = false;
      })
      .addCase(fetchBdSetting.pending, (state) => {
        state.bdSettingLoading = true;
      })
      .addCase(fetchBdSetting.fulfilled, (state, action) => {
        state.bdSettingLoading = false;
        state.bdSetting = action.payload;
      })
      .addCase(fetchBdSetting.rejected, (state) => {
        state.bdSettingLoading = false;
      });
  },
});

export const { setWithdrawPage, clearSubmitStatus } = withdrawSlice.actions;
export default withdrawSlice.reducer;
