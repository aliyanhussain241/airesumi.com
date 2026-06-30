// AutoTranslate — runtime DOM translator.
// Mount once near the root. Whenever the active i18n language changes (or new
// DOM nodes appear via React rendering / navigation), it walks the document,
// collects visible English text nodes + key attributes, batches them to
// /api/translate, caches the result in localStorage, and swaps the text
// in-place. No per-page code changes required.

import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

const CACHE_PREFIX = "tr_v1:";
const ATTR_DONE = "data-tr-done";
const ATTR_SRC = "data-tr-src"; // remembers the original English so we can restore on re-translate

// Skip these tags entirely — translating them breaks behavior or visuals.
const SKIP_TAGS = new Set([
  "SCRIPT", "STYLE", "NOSCRIPT", "CODE", "PRE", "KBD", "SAMP",
  "SVG", "PATH", "CANVAS", "VIDEO", "AUDIO", "IFRAME",
  "TEXTAREA", "INPUT", // values are user data
]);

// Skip if any ancestor has these attributes (used by code blocks, etc.)
function hasSkipAncestor(node: Node): boolean {
  let el: Node | null = node;
  while (el) {
    if (el.nodeType === 1) {
      const e = el as Element;
      if (SKIP_TAGS.has(e.tagName)) return true;
      if (e.hasAttribute("data-no-translate") || e.getAttribute("translate") === "no") return true;
      if (e.hasAttribute("contenteditable")) return true;
    }
    el = el.parentNode;
  }
  return false;
}

// Heuristic: only translate strings that look like prose, not numbers / hashes / urls / brand-only.
function shouldTranslate(text: string): boolean {
  const t = text.trim();
  if (t.length < 2) return false;
  if (t.length > 600) return false; // skip giant blobs (full articles)
  if (!/[A-Za-z]/.test(t)) return false; // pure numbers / symbols / emoji
  if (/^https?:\/\//i.test(t)) return false;
  if (/^[A-Z0-9_./-]+$/.test(t) && t.length < 8) return false; // codes / abbreviations
  return true;
}

type Job = { kind: "text"; node: Text; src: string }
         | { kind: "attr"; el: Element; name: string; src: string };

function cacheGet(lang: string, src: string): string | null {
  try { return localStorage.getItem(CACHE_PREFIX + lang + ":" + src); } catch { return null; }
}
function cacheSet(lang: string, src: string, tr: string) {
  try { localStorage.setItem(CACHE_PREFIX + lang + ":" + src, tr); } catch {}
}

async function translateBatch(texts: string[], lang: string): Promise<string[]> {
  try {
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texts, lang }),
    });
    if (!res.ok) return texts;
    const data = await res.json();
    return Array.isArray(data?.translations) ? data.translations : texts;
  } catch {
    return texts;
  }
}

export function AutoTranslate() {
  const { i18n } = useTranslation();
  const langRef = useRef<string>(i18n.language || "en");
  const scheduledRef = useRef<number | null>(null);
  const runningRef = useRef(false);

  useEffect(() => {
    const lang = (i18n.language || "en").split("-")[0];
    langRef.current = lang;

    // Restore original English on every language change so we re-translate fresh.
    const restoreAll = () => {
      document.querySelectorAll(`[${ATTR_DONE}]`).forEach((el) => {
        const src = el.getAttribute(ATTR_SRC);
        if (src != null) {
          // attribute mode
          const attr = el.getAttribute(ATTR_DONE);
          if (attr && attr.startsWith("attr:")) {
            el.setAttribute(attr.slice(5), src);
          }
        }
        el.removeAttribute(ATTR_DONE);
        el.removeAttribute(ATTR_SRC);
      });
      // text nodes carry the original in a sibling marker we keep on parent
      document.querySelectorAll("[data-tr-orig]").forEach((el) => {
        const orig = el.getAttribute("data-tr-orig");
        if (orig != null && el.childNodes.length === 1 && el.firstChild?.nodeType === 3) {
          el.firstChild.textContent = orig;
        }
        el.removeAttribute("data-tr-orig");
      });
    };

    const collectJobs = (): Job[] => {
      const jobs: Job[] = [];

      // Text nodes
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode(n) {
          const text = n.nodeValue || "";
          if (!shouldTranslate(text)) return NodeFilter.FILTER_REJECT;
          if (hasSkipAncestor(n)) return NodeFilter.FILTER_REJECT;
          const parent = n.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          if (parent.hasAttribute(ATTR_DONE)) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        },
      });
      let cur: Node | null = walker.nextNode();
      while (cur) {
        jobs.push({ kind: "text", node: cur as Text, src: (cur.nodeValue || "").trim() });
        cur = walker.nextNode();
      }

      // Translate placeholder / title / aria-label attributes
      const attrNames = ["placeholder", "title", "aria-label"];
      attrNames.forEach((attr) => {
        document.querySelectorAll(`[${attr}]`).forEach((el) => {
          if (hasSkipAncestor(el)) return;
          const doneKey = `attr-${attr}-done`;
          if ((el as HTMLElement).dataset[doneKey.replace(/-([a-z])/g, (_, c) => c.toUpperCase())]) return;
          const v = el.getAttribute(attr) || "";
          if (!shouldTranslate(v)) return;
          jobs.push({ kind: "attr", el, name: attr, src: v.trim() });
        });
      });

      return jobs;
    };

    const apply = (job: Job, translated: string, original: string) => {
      if (job.kind === "text") {
        const parent = job.node.parentElement;
        if (!parent) return;
        // keep original padding/whitespace around the translated value
        const raw = job.node.nodeValue || "";
        const lead = raw.match(/^\s*/)?.[0] || "";
        const trail = raw.match(/\s*$/)?.[0] || "";
        parent.setAttribute("data-tr-orig", original);
        parent.setAttribute(ATTR_DONE, "text");
        job.node.nodeValue = lead + translated + trail;
      } else {
        job.el.setAttribute(ATTR_SRC, original);
        job.el.setAttribute(ATTR_DONE, "attr:" + job.name);
        job.el.setAttribute(job.name, translated);
      }
    };

    const run = async () => {
      if (runningRef.current) return;
      const lang = langRef.current;
      if (lang === "en") return;
      runningRef.current = true;
      try {
        const jobs = collectJobs();
        if (!jobs.length) return;

        // Resolve from cache first; collect uncached for one network round trip.
        const uncached: { src: string; jobs: Job[] }[] = [];
        const cachedApplied = new Set<Job>();
        const groupBySrc = new Map<string, Job[]>();
        for (const j of jobs) {
          const c = cacheGet(lang, j.src);
          if (c != null) {
            apply(j, c, j.src);
            cachedApplied.add(j);
          } else {
            const g = groupBySrc.get(j.src) || [];
            g.push(j);
            groupBySrc.set(j.src, g);
          }
        }
        for (const [src, jobsForSrc] of groupBySrc) uncached.push({ src, jobs: jobsForSrc });
        if (!uncached.length) return;

        // Batch in chunks of 80.
        const CHUNK = 80;
        for (let i = 0; i < uncached.length; i += CHUNK) {
          const slice = uncached.slice(i, i + CHUNK);
          const sources = slice.map((s) => s.src);
          const translations = await translateBatch(sources, lang);
          if (lang !== langRef.current) return; // user switched language mid-flight
          slice.forEach(({ src, jobs: js }, idx) => {
            const tr = translations[idx] || src;
            cacheSet(lang, src, tr);
            js.forEach((j) => apply(j, tr, src));
          });
        }
      } finally {
        runningRef.current = false;
      }
    };

    const schedule = () => {
      if (scheduledRef.current != null) return;
      scheduledRef.current = window.setTimeout(() => {
        scheduledRef.current = null;
        run();
      }, 250);
    };

    restoreAll();
    if (lang !== "en") schedule();

    const observer = new MutationObserver(() => {
      if (langRef.current === "en") return;
      schedule();
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });

    const onLang = () => {
      langRef.current = (i18n.language || "en").split("-")[0];
      restoreAll();
      if (langRef.current !== "en") schedule();
    };
    i18n.on("languageChanged", onLang);

    return () => {
      observer.disconnect();
      i18n.off("languageChanged", onLang);
      if (scheduledRef.current != null) clearTimeout(scheduledRef.current);
    };
  }, [i18n]);

  return null;
}
