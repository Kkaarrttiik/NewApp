import axios from "axios";
import {
  FETCH_ACTIVE_LANGUAGES_FAIL,
  FETCH_ACTIVE_LANGUAGES_REQUEST,
  FETCH_ACTIVE_LANGUAGES_SUCCESS,
  FETCH_TRANSLATIONS_FAIL,
  FETCH_TRANSLATIONS_REQUEST,
  FETCH_TRANSLATIONS_SUCCESS,
  SET_SELECTED_LANGUAGE,
} from "./type";

const STORAGE_KEY = "selectedLanguageCode";

// ─── localStorage helpers ─────────────────────────────────────────────────────
export const saveLanguageToStorage = (code) => {
  try {
    if (code) localStorage.setItem(STORAGE_KEY, code);
  } catch {}
};

export const readLanguageFromStorage = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) || null;
  } catch {
    return null;
  }
};

// ─── Set selected language (thunk) ───────────────────────────────────────────
export const setSelectedLanguage = (languageCode) => (dispatch) => {
  saveLanguageToStorage(languageCode);
  dispatch({ type: SET_SELECTED_LANGUAGE, payload: languageCode });
};

// ─── Fetch active languages ───────────────────────────────────────────────────
// After languages load, the reducer resolves the correct language
// using priority: URL param → localStorage → API default
// and saves the resolved language to localStorage.
export const fetchActiveLanguages = () => async (dispatch) => {
  dispatch({ type: FETCH_ACTIVE_LANGUAGES_REQUEST });
  try {
    const res = await axios.get("translation/getActiveLanguage", {
      params: { start: 1, limit: 100 },
    });
    const data = res?.data || {};
    if (!data.status) {
      dispatch({
        type: FETCH_ACTIVE_LANGUAGES_FAIL,
        payload: data.message || "Failed to fetch languages.",
      });
      return;
    }
    dispatch({ type: FETCH_ACTIVE_LANGUAGES_SUCCESS, payload: data.docs });
  } catch (err) {
    dispatch({ type: FETCH_ACTIVE_LANGUAGES_FAIL, payload: err.message });
  }
};

// ─── Fetch translations ───────────────────────────────────────────────────────
// Checks in-memory cache first — no API call if already fetched.
// When cached, still dispatches SUCCESS so translations state updates
// (needed when user switches back to a previously visited language).
export const fetchTranslations =
  (languageCode) => async (dispatch, getState) => {
    if (!languageCode) return;

    try {
      const cached = getState().language.translationCache[languageCode];
      if (cached) {
        dispatch({
          type: FETCH_TRANSLATIONS_SUCCESS,
          payload: { languageCode, translations: cached },
        });
        return; // ✅ no API call
      }

      dispatch({ type: FETCH_TRANSLATIONS_REQUEST });

      const res = await axios.get("translation/getLanguageTranslations", {
        params: { languageCode, module: "app" },
      });
      const data = res?.data || {};
      if (!data.status) {
        dispatch({
          type: FETCH_TRANSLATIONS_FAIL,
          payload: data.message || "Failed to fetch translations.",
        });
        return;
      }
      dispatch({
        type: FETCH_TRANSLATIONS_SUCCESS,
        payload: {
          languageCode,
          translations: data?.doc?.translations || {},
        },
      });
    } catch (err) {
      dispatch({ type: FETCH_TRANSLATIONS_FAIL, payload: err.message });
    }
  };
