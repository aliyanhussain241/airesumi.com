import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";

/**
 * Thin top progress bar shown during any route transition.
 *
 * Enhancements for slow fetches:
 *  - Smoother easing curve that keeps trickling toward 95% instead of stalling flat.
 *  - Guaranteed minimum visible time (~500ms) so fast navigations still show a
 *    perceptible bar and it doesn't flicker on/off.
 *  - Shimmer overlay for a premium "in progress" feel on long loads.
 */
const MIN_VISIBLE_MS = 500;   // keep the bar on screen at least this long
const FINISH_DELAY_MS = 320;  // time to animate to 100% and fade out
const TRICKLE_INTERVAL = 180;

export function RouteProgressBar() {
  const isNavigating = useRouterState({
    select: (s) => s.isLoading || s.isTransitioning || s.status === "pending",
  });

  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const startedAtRef = useRef<number | null>(null);

  useEffect(() => {
    let trickle: ReturnType<typeof setInterval> | undefined;
    let hideTimer: ReturnType<typeof setTimeout> | undefined;
    let finishTimer: ReturnType<typeof setTimeout> | undefined;

    if (isNavigating) {
      startedAtRef.current = performance.now();
      setVisible(true);
      setProgress((p) => (p < 8 ? 8 : p));

      trickle = setInterval(() => {
        setProgress((p) => {
          if (p >= 95) return p;
          // Ease-out: bigger jumps early, tiny crawl near the end so slow
          // fetches keep showing motion without ever hitting 100%.
          const remaining = 95 - p;
          const inc = Math.max(0.4, remaining * 0.08);
          return Math.min(95, p + inc);
        });
      }, TRICKLE_INTERVAL);
    } else if (visible) {
      const elapsed = startedAtRef.current
        ? performance.now() - startedAtRef.current
        : MIN_VISIBLE_MS;
      const wait = Math.max(0, MIN_VISIBLE_MS - elapsed);

      finishTimer = setTimeout(() => {
        setProgress(100);
        hideTimer = setTimeout(() => {
          setVisible(false);
          setProgress(0);
          startedAtRef.current = null;
        }, FINISH_DELAY_MS);
      }, wait);
    }

    return () => {
      if (trickle) clearInterval(trickle);
      if (hideTimer) clearTimeout(hideTimer);
      if (finishTimer) clearTimeout(finishTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNavigating]);

  return (
    <>
      <style>{`
        @keyframes rpb-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .rpb-shimmer::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255,255,255,0.55) 50%,
            transparent 100%
          );
          animation: rpb-shimmer 1.4s ease-in-out infinite;
        }
      `}</style>
      <div
        aria-hidden="true"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
        className="pointer-events-none fixed inset-x-0 top-0 z-[9999] h-[3px] overflow-hidden"
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 300ms ease-out",
        }}
      >
        <div
          className="rpb-shimmer relative h-full bg-gradient-to-r from-[#FF6321] via-[#FF8A4C] to-[#FF6321] shadow-[0_0_12px_rgba(255,99,33,0.75)]"
          style={{
            width: `${progress}%`,
            // Cubic-bezier ease-out for a smoother, less linear feel.
            transition: "width 380ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
      </div>
    </>
  );
}
