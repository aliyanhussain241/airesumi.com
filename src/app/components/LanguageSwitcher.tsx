import { useEffect, useRef, useState } from "react";
import { Globe, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LANGUAGES, setLanguage, getCurrentLanguage, type LangCode } from "@/app/lib/i18n";

export const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const current = getCurrentLanguage();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  // Keep <html lang/dir> in sync with the active language
  useEffect(() => {
    const code = (i18n.language || "en").split("-")[0] as LangCode;
    const meta = LANGUAGES.find((l) => l.code === code);
    if (typeof document !== "undefined") {
      document.documentElement.lang = code;
      document.documentElement.dir = meta?.dir ?? "ltr";
    }
  }, [i18n.language]);

  const currentMeta = LANGUAGES.find((l) => l.code === current) ?? LANGUAGES[0];

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t("language.select")}
        className="hdr-btn-outline flex items-center gap-1.5 p-2 rounded-xl text-[#374151] dark:text-orange-200 cursor-pointer"
      >
        <Globe size={16} />
        <span className="text-[12px] font-semibold uppercase">{currentMeta.code}</span>
      </button>

      {open && (
        <div
          role="menu"
          aria-label={t("language.switch")}
          className="absolute right-0 top-[calc(100%+8px)] w-56 rounded-2xl overflow-hidden z-[1100] shadow-xl border border-black/10 dark:border-white/10"
          style={{
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(24px) saturate(180%)",
          }}
        >
          <div className="max-h-[360px] overflow-y-auto py-2">
            {LANGUAGES.map((lng) => {
              const active = lng.code === current;
              return (
                <button
                  key={lng.code}
                  role="menuitem"
                  onClick={() => { setLanguage(lng.code); setOpen(false); }}
                  className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left text-[13px] hover:bg-orange-50 dark:hover:bg-white/5 transition-colors ${active ? "text-[#EA580C] font-semibold" : "text-[#374151] dark:text-orange-100"}`}
                >
                  <span className="flex items-center gap-2">
                    <span className="font-medium">{lng.native}</span>
                    <span className="text-[11px] text-[#9ca3af] uppercase">{lng.code}</span>
                  </span>
                  {active && <Check size={14} className="text-[#EA580C]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
