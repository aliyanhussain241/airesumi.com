import { useEffect, useRef } from "react";

/**
 * Adsterra 728x90 banner.
 * Loads the ad network scripts client-side only (safe for SSR).
 */
export function AdBanner() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    // Avoid double-injection on route changes / re-mounts
    if (el.dataset.loaded === "true") return;
    el.dataset.loaded = "true";

    const optionsScript = document.createElement("script");
    optionsScript.type = "text/javascript";
    optionsScript.innerHTML = `atOptions = {
      'key' : 'd3118ae46e5468e30517753faca5b1a6',
      'format' : 'iframe',
      'height' : 90,
      'width' : 728,
      'params' : {}
    };`;

    const invokeScript = document.createElement("script");
    invokeScript.type = "text/javascript";
    invokeScript.src = "//www.highperformanceformat.com/d3118ae46e5468e30517753faca5b1a6/invoke.js";
    invokeScript.async = true;

    el.appendChild(optionsScript);
    el.appendChild(invokeScript);
  }, []);

  return (
    <div className="w-full flex justify-center my-8 print:hidden">
      <div
        ref={containerRef}
        style={{ width: 728, maxWidth: "100%", minHeight: 90 }}
        aria-label="Advertisement"
      />
    </div>
  );
}

export default AdBanner;
