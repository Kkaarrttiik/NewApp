import { useSelector } from "react-redux";

/**
 * useTranslation — returns a `t(key)` function that translates a key using
 * the currently loaded translations from Redux.
 *
 * Usage:
 *   const { t } = useTranslation();
 *   <p>{t("Dashboard")}</p>
 *
 * If the key is not found in translations, the key itself is returned as fallback.
 */

const useTranslation = () => {
  const translations = useSelector((state) => state.language.translations);

  const t = (key, params = {}) => {
    if (!key) return "";
    let text = translations[key];
    if (text === undefined) {
      const prefixed = `_${key}`;
      text = translations[prefixed];
    }
    if (text === undefined) {
      return key;
    }

    if (params && typeof params === "object") {
      Object.entries(params).forEach(([param, value]) => {
        const token = `{${param}}`;
        text = String(text).replaceAll(token, String(value));
      });
    }

    return text;
  };

  return { t };
};

export default useTranslation;
