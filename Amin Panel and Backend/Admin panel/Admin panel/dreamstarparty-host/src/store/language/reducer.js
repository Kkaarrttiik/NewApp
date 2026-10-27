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

// ─── Helpers ──────────────────────────────────────────────────────────────────
// const saveToStorage = (code) => {
//   try {
//     if (code) localStorage.setItem(STORAGE_KEY, code);
//   } catch {}
// };

const readFromStorage = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) || null;
  } catch {
    return null;
  }
};

const readObjFromStorage = () => {
  try {
    const data = localStorage.getItem("selectedLanguage");
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

const readTranslationsFromStorage = () => {
  try {
    const data = localStorage.getItem("translations");
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

const saveToStorage = (lang) => {
  try {
    if (lang?.languageCode) {
      localStorage.setItem(STORAGE_KEY, lang.languageCode);
      localStorage.setItem("selectedLanguage", JSON.stringify(lang));
    }
  } catch { }
};

const saveTranslationsToStorage = (translations) => {
  try {
    if (translations) {
      localStorage.setItem("translations", JSON.stringify(translations));
    }
  } catch { }
};

// Read URL param — used at boot time only
const getUrlLanguage = () => {
  try {
    return (
      new URLSearchParams(window.location.search)
        .get("language")
        ?.trim()
        ?.toLowerCase() || null
    );
  } catch {
    return null;
  }
};

const initialState = {
  activeLanguages: [],
  selectedLanguageCode: readFromStorage(), // always from localStorage
  // selectedLanguage: null,
  // translations: {},
  selectedLanguage: readObjFromStorage(),
  translations: readTranslationsFromStorage(),
  loadingLanguages: false,
  loadingTranslations: false,
  error: null,
  translationCache: {},
};

// ─── Reducer ──────────────────────────────────────────────────────────────────
const languageReducer = (state = initialState, action) => {
  switch (action.type) {
    // ── User manually selected a language from the switcher ───────────────────
    // localStorage is already written by the thunk in action.js,
    // but we write it here too as a safety net.
    case SET_SELECTED_LANGUAGE: {
      const code = action.payload;
      const lang = state.activeLanguages.find(
        (l) => l.languageCode?.toLowerCase() === code?.toLowerCase(),
      );
      // saveToStorage(code); // safety net
      if (lang) saveToStorage(lang); // save the whole object
      return {
        ...state,
        selectedLanguageCode: code,
        // selectedLanguage: lang || null,
        selectedLanguage: lang || state.selectedLanguage, // Keep old one if not found in current list yet
      };
    }

    // ── Active languages fetching ─────────────────────────────────────────────
    case FETCH_ACTIVE_LANGUAGES_REQUEST:
      return { ...state, loadingLanguages: true, error: null };

    case FETCH_ACTIVE_LANGUAGES_SUCCESS: {
      const activeLanguages = action.payload;

      const localLang = readFromStorage()?.toLowerCase();

      const findLang = (code) =>
        code &&
        activeLanguages.find((l) => l.languageCode?.toLowerCase() === code);

      const localMatch = findLang(localLang);
      const defaultLang =
        activeLanguages.find((l) => l.isDefault) || activeLanguages[0];

      const resolved = localMatch || defaultLang;

      if (resolved) {
        // saveToStorage(resolved.languageCode);
        saveToStorage(resolved);
        return {
          ...state,
          loadingLanguages: false,
          activeLanguages,
          selectedLanguageCode: resolved.languageCode,
          selectedLanguage: resolved,
        };
      }

      return { ...state, loadingLanguages: false, activeLanguages };
    }

    case FETCH_ACTIVE_LANGUAGES_FAIL:
      return { ...state, loadingLanguages: false, error: action.payload };

    // ── Translations ──────────────────────────────────────────────────────────
    case FETCH_TRANSLATIONS_REQUEST:
      return { ...state, loadingTranslations: true, error: null };

    case FETCH_TRANSLATIONS_SUCCESS:
      saveTranslationsToStorage(action.payload.translations);
      return {
        ...state,
        loadingTranslations: false,
        translations: action.payload.translations,
        translationCache: {
          ...state.translationCache,
          [action.payload.languageCode]: action.payload.translations,
        },
      };

    case FETCH_TRANSLATIONS_FAIL:
      return { ...state, loadingTranslations: false, error: action.payload };

    default:
      return state;
  }
};

export default languageReducer;
