import { lazy, Suspense, useEffect, useRef, useState } from "react";
import type { BlogHighlightPost } from "./BlogHighlights";

// Dynamic import (code-split chunk). Requires a default export in the target module.
const BlogHighlights = lazy(() =>
  import("./BlogHighlights").then((m) => ({ default: m.BlogHighlights })),
);

interface Props {
  posts: BlogHighlightPost[];
  eyebrow?: string;
  heading?: string;
  subheading?: string;
}

/**
 * Renders BlogHighlights only when it scrolls near the viewport.
 * Reserves ~600px of vertical space to prevent layout shift.
 */
export function BlogHighlightsLazy(props: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [visible]);

  return (
    <div ref={ref} style={{ minHeight: visible ? undefined : 600 }}>
      {visible ? (
        <Suspense fallback={<div style={{ minHeight: 600 }} aria-hidden />}>
          <BlogHighlights {...props} />
        </Suspense>
      ) : null}
    </div>
  );
}
