import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "../../util/api";

// Fetch all active languages for the dropdown
export const fetchActiveLanguages = createAsyncThunk(
  "language/fetchActiveLanguages",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiRequest("translation/getActiveLanguage", {
        params: { start: 1, limit: 100 },
      });
      if (!res.status)
        return rejectWithValue(res.message || "Failed to fetch languages.");
      return res.docs;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

// In languageSlice.js — fetchTranslations async thunk
export const fetchTranslations = createAsyncThunk(
  "language/fetchTranslations",
  async (languageCode, { rejectWithValue, getState }) => {
    try {
      const cached = getState().language.translationCache[languageCode];
      if (cached) return { languageCode, translations: cached };

      const res = await apiRequest("translation/getLanguageTranslations", {
        params: { languageCode, module: "app" },
      });
      if (!res.status)
        return rejectWithValue(res.message || "Failed to fetch translations.");
      return { languageCode, translations: res.doc.translations };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const getSavedLanguage = () => {
  try {
    const urlLang = new URLSearchParams(window.location.search)
      .get("language")
      ?.trim();
    return urlLang || localStorage.getItem("selectedLanguageCode") || null;
  } catch {
    return null;
  }
};

const languageSlice = createSlice({
  name: "language",
  initialState: {
    activeLanguages: [],
    selectedLanguageCode: getSavedLanguage(),
    selectedLanguage: null,
    translations: {},
    loadingLanguages: false,
    loadingTranslations: false,
    error: null,
    // Cache translations per language code to avoid refetching
    translationCache: {},
  },
  reducers: {
    setSelectedLanguage(state, action) {
      const lang = state.activeLanguages.find(
        (l) => l.languageCode === action.payload,
      );
      state.selectedLanguageCode = action.payload;
      state.selectedLanguage = lang || null;
      try {
        localStorage.setItem("selectedLanguageCode", action.payload);
      } catch {}
    },
  },
  extraReducers: (builder) => {
    builder
      // Active languages
      .addCase(fetchActiveLanguages.pending, (state) => {
        state.loadingLanguages = true;
        state.error = null;
      })
      .addCase(fetchActiveLanguages.fulfilled, (state, action) => {
        state.loadingLanguages = false;
        state.activeLanguages = action.payload;

        const urlLang = new URLSearchParams(window.location.search)
          .get("language")
          ?.trim();
        const localLang = localStorage.getItem("selectedLanguageCode");
        const defaultLang =
          action.payload.find((l) => l.isDefault) || action.payload[0];

        // 1. URL param — only if it exists in active list
        const urlMatch =
          urlLang && action.payload.find((l) => l.languageCode === urlLang);

        // 2. localStorage — only if it exists in active list
        const localMatch =
          localLang && action.payload.find((l) => l.languageCode === localLang);

        const resolved = urlMatch || localMatch || defaultLang;

        if (resolved) {
          state.selectedLanguageCode = resolved.languageCode;
          state.selectedLanguage = resolved;
          try {
            localStorage.setItem("selectedLanguageCode", resolved.languageCode);
          } catch {}
        }
      })
      .addCase(fetchActiveLanguages.rejected, (state, action) => {
        state.loadingLanguages = false;
        state.error = action.payload;
      })
      // Translations
      .addCase(fetchTranslations.pending, (state) => {
        state.loadingTranslations = true;
        state.error = null;
      })
      .addCase(fetchTranslations.fulfilled, (state, action) => {
        state.loadingTranslations = false;
        state.translations = action.payload.translations;
        // Cache it
        state.translationCache[action.payload.languageCode] =
          action.payload.translations;
      })
      .addCase(fetchTranslations.rejected, (state, action) => {
        state.loadingTranslations = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedLanguage } = languageSlice.actions;
export default languageSlice.reducer;
