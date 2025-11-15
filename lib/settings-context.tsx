"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, Language, TranslationKey } from "./translations";

interface SettingsContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  textSize: "small" | "normal" | "large" | "larger";
  increaseTextSize: () => void;
  decreaseTextSize: () => void;
  resetTextSize: () => void;
  t: (key: TranslationKey) => string;
  isRTL: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("fr");
  const [textSize, setTextSize] = useState<
    "small" | "normal" | "large" | "larger"
  >("normal");

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    const savedTextSize = localStorage.getItem("textSize") as
      | "small"
      | "normal"
      | "large"
      | "larger";

    if (
      savedLanguage &&
      (savedLanguage === "fr" ||
        savedLanguage === "en" ||
        savedLanguage === "ar")
    ) {
      setLanguageState(savedLanguage);
      document.documentElement.lang = savedLanguage;
      document.documentElement.dir = savedLanguage === "ar" ? "rtl" : "ltr";
    }

    if (savedTextSize) {
      setTextSize(savedTextSize);
      document.documentElement.setAttribute("data-text-size", savedTextSize);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  };

  const increaseTextSize = () => {
    const newSize =
      textSize === "small"
        ? "normal"
        : textSize === "normal"
        ? "large"
        : textSize === "large"
        ? "larger"
        : "larger";
    setTextSize(newSize);
    localStorage.setItem("textSize", newSize);
    document.documentElement.setAttribute("data-text-size", newSize);
  };

  const decreaseTextSize = () => {
    const newSize =
      textSize === "larger"
        ? "large"
        : textSize === "large"
        ? "normal"
        : textSize === "normal"
        ? "small"
        : "small";
    setTextSize(newSize);
    localStorage.setItem("textSize", newSize);
    document.documentElement.setAttribute("data-text-size", newSize);
  };

  const resetTextSize = () => {
    setTextSize("normal");
    localStorage.setItem("textSize", "normal");
    document.documentElement.setAttribute("data-text-size", "normal");
  };

  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  const isRTL = language === "ar";

  return (
    <SettingsContext.Provider
      value={{
        language,
        setLanguage,
        textSize,
        increaseTextSize,
        decreaseTextSize,
        resetTextSize,
        t,
        isRTL,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
