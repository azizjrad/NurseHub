"use client";

import { useSettings } from "@/lib/settings-context";

export default function AccessibilityToolbar() {
  const {
    language,
    setLanguage,
    textSize,
    increaseTextSize,
    decreaseTextSize,
    resetTextSize,
    t,
  } = useSettings();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {/* Text Size Controls and Language Switcher */}
      <div className="bg-bg-card border-2 border-border-color rounded-2xl shadow-lg p-2 flex flex-col gap-2">
        <button
          onClick={increaseTextSize}
          disabled={textSize === "larger"}
          className="w-12 h-12 rounded-xl bg-bg-secondary hover:bg-accent-primary hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-bold text-xl"
          title={t("increaseTextSize")}
          aria-label={t("increaseTextSize")}
        >
          A+
        </button>
        <button
          onClick={resetTextSize}
          className="w-12 h-12 rounded-xl bg-bg-secondary hover:bg-accent-primary hover:text-white transition-all flex items-center justify-center font-bold text-lg"
          title={t("resetTextSize")}
          aria-label={t("resetTextSize")}
        >
          A
        </button>
        <button
          onClick={decreaseTextSize}
          disabled={textSize === "small"}
          className="w-12 h-12 rounded-xl bg-bg-secondary hover:bg-accent-primary hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-bold text-sm"
          title={t("decreaseTextSize")}
          aria-label={t("decreaseTextSize")}
        >
          A-
        </button>

        {/* Language Switcher */}
        <button
          onClick={() => {
            const nextLanguage =
              language === "fr" ? "ar" : language === "ar" ? "en" : "fr";
            setLanguage(nextLanguage);
          }}
          className="w-12 h-12 rounded-xl bg-accent-primary text-white flex items-center justify-center font-bold text-lg"
          title={t("switchLanguage")}
          aria-label={t("switchLanguage")}
        >
          {language === "fr" ? "FR" : language === "ar" ? "ع" : "EN"}
        </button>
      </div>
    </div>
  );
}
