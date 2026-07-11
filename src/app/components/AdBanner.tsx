import { useEffect, useRef } from "react";

type AdVariant = "leaderboard" | "medium-rectangle";

interface AdConfig {
  key: string;
  width: number;
  height: number;
  invokeSrc: string;
}

const AD_CONFIGS: Record<AdVariant, AdConfig> = {
  // 728x90 leaderboard
  leaderboard: {
    key: "d3118ae46e5468e30517753faca5b1a6",
    width: 728,
    height: 90,
    invokeSrc: "//www.highperformanceformat.com/d3118ae46e5468e30517753faca5b1a6/invoke.js",
  },
  // 300x250 medium rectangle
  "medium-rectangle": {
    key: "a97639dc98753ea6c2a172e8bf51c806",
    width: 300,
    height: 250,
    invokeSrc: "//www.highperformanceformat.com/a97639dc98753ea6c2a172e8bf51c806/invoke.js",
  },
};

interface AdBannerProps {
  variant?: AdVariant;
  className?: string;
}

/**
 * Adsterra ad slot. Loads the ad network scripts client-side only (SSR-safe).
 */
export function AdBanner({ variant = "leaderboard", className }: AdBannerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cfg = AD_CONFIGS[variant];

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (el.dataset.loaded === "true") return;
    el.dataset.loaded = "true";

    const optionsScript = document.createElement("script");
    optionsScript.type = "text/javascript";
    optionsScript.innerHTML = `atOptions = {
      'key' : '${cfg.key}',
      'format' : 'iframe',
      'height' : ${cfg.height},
      'width' : ${cfg.width},
      'params' : {}
    };`;

    const invokeScript = document.createElement("script");
    invokeScript.type = "text/javascript";
    invokeScript.src = cfg.invokeSrc;
    invokeScript.async = true;

    el.appendChild(optionsScript);
    el.appendChild(invokeScript);
  }, [cfg]);

  return (
    <div className={`w-full flex justify-center my-8 print:hidden ${className ?? ""}`}>
      <div
        ref={containerRef}
        style={{ width: cfg.width, maxWidth: "100%", minHeight: cfg.height }}
        aria-label="Advertisement"
      />
    </div>
  );
}

export default AdBanner;
