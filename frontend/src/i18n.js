import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";

// Get initial language from localStorage or browser
const getInitialLanguage = () => {
  if (typeof window === "undefined") return "en";
  const saved = localStorage.getItem("autoverge_lang");
  if (saved === "en" || saved === "si") return saved;
  return "en";
};

i18next
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    lng: getInitialLanguage(),
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: "/locales/{{lng}}/translation.json",
    },
    react: {
      useSuspense: false,
    },
  });

// Persist language preference to localStorage
i18next.on("languageChanged", (lng) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("autoverge_lang", lng);
  }
});

export default i18next;
