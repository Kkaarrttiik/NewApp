import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "sonner";
import { apiRequest } from "../../util/api";

const LIMIT = 10;

// ─────────────────────────────────────────────────────────────────────────────
// Thunks — List
// ─────────────────────────────────────────────────────────────────────────────

export const fetchAgencies = createAsyncThunk(
  "agencies/fetchAgencies",
  async (filters, { rejectWithValue }) => {
    try {
      const page = filters?.page || 1;
      const res = await apiRequest("bd/myAgencies", {
        params: {
          start: page,
          limit: LIMIT,
          ...(filters?.search && { search: filters.search }),
          ...(filters?.country &&
            filters.country !== "Country" && { country: filters.country }),
          ...(filters?.status &&
            filters.status !== "Status" && {
            status: filters.status.toLowerCase(),
          }),
          ...(filters?.startDate && { startDate: filters.startDate }),
          ...(filters?.endDate && { endDate: filters.endDate }),
        },
      });
      if (!res.status) return rejectWithValue(res.message || "Failed to load agencies.");
      return { data: res.data, total: res.total };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// Thunks — Dialog dropdowns
// ─────────────────────────────────────────────────────────────────────────────

export const fetchBdDropdown = createAsyncThunk(
  "agencies/fetchBdDropdown",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiRequest("bd/getBDDropdown");
      if (!res.status) return rejectWithValue(res.message || "Failed to load BD list.");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchUniqueIdUsers = createAsyncThunk(
  "agencies/fetchUniqueIdUsers",
  async ({ page = 1, search = "", append = false } = {}, { rejectWithValue }) => {
    try {
      const res = await apiRequest("user/getUsersUniqueId", {
        params: {
          start: page,
          limit: LIMIT,
          ...(search.trim() && { search: search.trim() }),
        },
      });
      const data = Array.isArray(res?.data) ? res.data : [];
      return { data, page, append };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// Thunks — CRUD
// ─────────────────────────────────────────────────────────────────────────────

export const createAgency = createAsyncThunk(
  "agencies/createAgency",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await apiRequest("agency/store", { method: "POST", data: payload });
      if (!res.status) return rejectWithValue(res.message || "Failed to create agency.");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateAgency = createAsyncThunk(
  "agencies/updateAgency",
  async ({ payload, agencyId }, { rejectWithValue }) => {
    try {
      const res = await apiRequest("agency/update", {
        method: "PATCH",
        params: { agencyId },
        data: payload,
      });
      if (!res.status) return rejectWithValue(res.message || "Failed to update agency.");
      return { data: res.data, id: agencyId };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// Slice
// ─────────────────────────────────────────────────────────────────────────────

const agenciesSlice = createSlice({
  name: "agencies",
  initialState: {
    // ── Table ──
    list: [],
    total: 0,
    currentPage: 1,
    loading: false,
    error: null,

    // ── Dialog ──
    dialog: {
      open: false,
      data: null, // null → create mode | object → edit mode
    },
    dialogLoading: false,
    dialogError: null,

    // ── BD dropdown ──
    bdUsers: [],
    bdLoading: false,

    // ── UniqueId users (paginated) ──
    uniqueIdUsers: [],
    uniqueIdPage: 1,
    uniqueIdHasMore: true,
    uniqueIdLoading: false,
  },

  reducers: {
    // ── Table ──
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
    clearAgencies(state) {
      state.list = [];
      state.total = 0;
      state.currentPage = 1;
      state.loading = false;
      state.error = null;
    },

    // ── Dialog open/close ──
    openCreateDialog(state) {
      state.dialog = { open: true, data: null };
      state.dialogError = null;
    },
    openEditDialog(state, action) {
      state.dialog = { open: true, data: action.payload };
      state.dialogError = null;
    },
    closeDialog(state) {
      state.dialog = { open: false, data: null };
      state.dialogError = null;
      // Clear dropdown data so next open starts fresh
      state.bdUsers = [];
      state.uniqueIdUsers = [];
      state.uniqueIdPage = 1;
      state.uniqueIdHasMore = true;
    },

    // ── UniqueId pagination reset (called before a new search) ──
    resetUniqueIdPagination(state) {
      state.uniqueIdUsers = [];
      state.uniqueIdPage = 1;
      state.uniqueIdHasMore = true;
    },
  },

  extraReducers: (builder) => {
    // ── Fetch agencies ──────────────────────────────────────────────────────
    builder
      .addCase(fetchAgencies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgencies.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.list = payload.data;
        state.total = payload.total;
      })
      .addCase(fetchAgencies.rejected, (state, { payload }) => {
        state.loading = false;
        // Preserve the original suppression logic from your existing slice
        if (payload !== "Invalid BD ID" && payload !== "BD ID is required") {
          state.error = payload;
        }
      });

    // ── BD dropdown ─────────────────────────────────────────────────────────
    builder
      .addCase(fetchBdDropdown.pending, (state) => {
        state.bdLoading = true;
      })
      .addCase(fetchBdDropdown.fulfilled, (state, { payload }) => {
        state.bdLoading = false;
        state.bdUsers = payload;
      })
      .addCase(fetchBdDropdown.rejected, (state) => {
        state.bdLoading = false;
      });

    // ── UniqueId users (infinite-scroll) ────────────────────────────────────
    builder
      .addCase(fetchUniqueIdUsers.pending, (state) => {
        state.uniqueIdLoading = true;
      })
      .addCase(fetchUniqueIdUsers.fulfilled, (state, { payload }) => {
        state.uniqueIdLoading = false;
        const { data, page, append } = payload;
        // If API returned fewer rows than the limit, we've hit the end
        state.uniqueIdHasMore = data.length === LIMIT;
        state.uniqueIdPage = page;
        state.uniqueIdUsers = append
          ? [...state.uniqueIdUsers, ...data]
          : data;
      })
      .addCase(fetchUniqueIdUsers.rejected, (state) => {
        state.uniqueIdLoading = false;
      });

    // ── Create agency ────────────────────────────────────────────────────────
    builder
      .addCase(createAgency.pending, (state) => {
        state.dialogLoading = true;
        state.dialogError = null;
      })
      .addCase(createAgency.fulfilled, (state, { payload }) => {
        state.dialogLoading = false;
        state.list.unshift(payload);
        state.total += 1;
        state.dialog = { open: false, data: null };
        toast.success("Agency created successfully");
      })
      .addCase(createAgency.rejected, (state, { payload }) => {
        state.dialogLoading = false;
        state.dialogError = payload;
        toast.error(payload);
      });

    // ── Update agency ────────────────────────────────────────────────────────
    builder
      .addCase(updateAgency.pending, (state) => {
        state.dialogLoading = true;
        state.dialogError = null;
      })
      .addCase(updateAgency.fulfilled, (state, { payload }) => {
        state.dialogLoading = false;
        state.list = state.list.map((a) => a._id === payload.id ? payload.data : a);
        state.dialog = { open: false, data: null };
        toast.success("Agency updated successfully");
      })
      .addCase(updateAgency.rejected, (state, { payload }) => {
        state.dialogLoading = false;
        state.dialogError = payload;
        toast.error(payload);
      })
  },
});

export const {
  setCurrentPage,
  clearAgencies,
  openCreateDialog,
  openEditDialog,
  closeDialog,
  resetUniqueIdPagination,
} = agenciesSlice.actions;

export default agenciesSlice.reducer;