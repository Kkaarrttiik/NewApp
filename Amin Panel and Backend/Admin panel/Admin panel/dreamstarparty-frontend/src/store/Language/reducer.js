import {
  CLOSE_LANGUAGE_DIALOG,
  CREATE_LANGUAGE,
  DELETE_LANGUAGE,
  GET_LANGUAGE,
  GET_SINGLE_LANGUAGE,
  GET_TRANSLATION,
  OPEN_LANGUAGE_DIALOG,
  TOGGLE_LANGUAGE,
  UPDATE_LANGUAGE,
  UPDATE_TRANSLATION,
  UPLOAD_TRANSLATION,
} from "./types";

const initialState = {
  languages: [],
  translations: null,
  total: 0,
  dialog: false,
  dialogData: null,
};

const languageReducer = (state = initialState, action) => {
  switch (action.type) {

    // ✅ GET ALL
    case GET_LANGUAGE:
      return {
        ...state,
        languages: action.payload.languages,
        total: action.payload.total,
      };

    // ✅ GET SINGLE
    case GET_SINGLE_LANGUAGE:
      return {
        ...state,
        languages: [action.payload],
        total: 1,
      };

    // ✅ CREATE
    case CREATE_LANGUAGE:
      return {
        ...state,
        languages: [action.payload, ...state.languages],
      };

    // ✅ UPDATE
    case UPDATE_LANGUAGE:
      return {
        ...state,
        languages: state.languages.map((lang) =>
          lang._id === action.payload.id ? action.payload.data : lang
        ),
      };

    // ✅ DELETE
    case DELETE_LANGUAGE:
      return {
        ...state,
        languages: state.languages.filter(
          (lang) => lang.languageCode !== action.payload
        ),
      };

    // ✅ TOGGLE (Active / Default)
    case TOGGLE_LANGUAGE:
      return {
        ...state,
        languages: state.languages.map((lang) => {
          if (lang.languageCode === action.payload.languageCode) {

            // Active toggle
            if (action.payload.toggleType === 1) {
              return {
                ...lang,
                isActive: action.payload.data.isActive,
              };
            }

            // Default toggle (only one true)
            if (action.payload.toggleType === 2) {
              return {
                ...lang,
                isDefault: true,
              };
            }
          }

          // reset others if default changed
          if (action.payload.toggleType === 2) {
            return {
              ...lang,
              isDefault: false,
            };
          }

          return lang;
        }),
      };

    // ✅ GET TRANSLATION
    case GET_TRANSLATION:
      return {
        ...state,
        translations: action.payload,
      };

    // ✅ UPDATE TRANSLATION
    case UPDATE_TRANSLATION:
      return {
        ...state,
        translations: {
          ...state.translations,
          ...action.payload,
        },
      };

    // ✅ UPLOAD (no state change needed)
    case UPLOAD_TRANSLATION:
      return state;

    // ✅ OPEN DIALOG
    case OPEN_LANGUAGE_DIALOG:
      return {
        ...state,
        dialog: true,
        dialogData: action.payload || null,
      };

    // ✅ CLOSE DIALOG
    case CLOSE_LANGUAGE_DIALOG:
      return {
        ...state,
        dialog: false,
        dialogData: null,
      };

    default:
      return state;
  }
};

export default languageReducer;