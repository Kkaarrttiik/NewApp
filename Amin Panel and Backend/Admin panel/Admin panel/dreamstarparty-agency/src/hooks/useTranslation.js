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

      // Support dot notation: "errors.required"
      const raw = key
        .split(".")
        .reduce(
          (obj, part) =>
            obj && typeof obj === "object" ? obj[part] : undefined,
          translations,
        );

      let result =
        typeof raw === "string"
          ? raw
          : typeof fallback === "string"
            ? fallback
            : key;

      // {{varName}} interpolation
      if (vars && typeof vars === "object") {
        result = result.replace(/\{\{(\w+)\}\}/g, (_, varName) =>
          Object.prototype.hasOwnProperty.call(vars, varName)
            ? String(vars[varName])
            : `{{${varName}}}`,
        );
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
