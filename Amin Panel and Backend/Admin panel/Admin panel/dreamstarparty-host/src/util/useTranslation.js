import { useSelector } from "react-redux";
import { useCallback } from "react";

const useTranslation = () => {
  const {
    translations,
    selectedLanguage,
    selectedLanguageCode,
    loadingTranslations,
  } = useSelector((state) => state.language);

  const t = useCallback(
    (key, fallback, vars) => {
      if (!key) return "";

      const raw = key.split(".").reduce((obj, part) => {
        if (obj && typeof obj === "object") return obj[part];
        return undefined;
      }, translations);

      let result =
        typeof raw === "string"
          ? raw
          : typeof fallback === "string"
            ? fallback
            : key; // last resort: return the key itself

      // Variable interpolation: replace {{varName}} with values from vars
      if (vars && typeof vars === "object") {
        result = result.replace(/\{\{(\w+)\}\}/g, (_, varName) => {
          return Object.prototype.hasOwnProperty.call(vars, varName)
            ? String(vars[varName])
            : `{{${varName}}}`;
        });
      }

      return result;
    },
    [translations],
  );

  return {
    t,
    language: selectedLanguage,
    languageCode: selectedLanguageCode,
    isLoading: loadingTranslations,
  };
};

export default useTranslation;
