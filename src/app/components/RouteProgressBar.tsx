import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";

/**
 * Thin top progress bar shown during any route transition.
 * Renders once in the root layout so every page gets the same load pattern.
 */
export function RouteProgressBar() {
  const isNavigating = useRouterState({
    select: (s) => s.isLoading || s.isTransitioning || s.status === "pending",
  });

  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let trickle: ReturnType<typeof setInterval> | undefined;
    let hideTimer: ReturnType<typeof setTimeout> | undefined;

    if (isNavigating) {
      setVisible(true);
      setProgress(10);
      trickle = setInterval(() => {
        setProgress((p) => {
          if (p >= 90) return p;
          // ease toward 90%
          const inc = Math.max(1, (90 - p) * 0.12);
          return Math.min(90, p + inc);
        });
      }, 200);
    } else if (visible) {
      setProgress(100);
      hideTimer = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 250);
    }

    return () => {
      if (trickle) clearInterval(trickle);
      if (hideTimer) clearTimeout(hideTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNavigating]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[9999] h-[3px]"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 200ms ease-out" }}
    >
      <div
        className="h-full bg-gradient-to-r from-[#FF6321] via-[#FF8A4C] to-[#FF6321] shadow-[0_0_10px_rgba(255,99,33,0.7)]"
        style={{
          width: `${progress}%`,
          transition: "width 200ms ease-out",
        }}
      />
    </div>
  );
}
