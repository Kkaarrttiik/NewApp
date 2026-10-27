import { useSelector } from "react-redux";

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
