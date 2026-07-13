import { createFileRoute, redirect } from "@tanstack/react-router";

// /examples is retired — the canonical examples page now lives at /resume-examples.
// A 301 is issued in beforeLoad so SSR responds with a real permanent redirect
// (crawlers see 301, not a client-side navigate).
export const Route = createFileRoute("/examples")({
  beforeLoad: () => {
    throw redirect({
      to: "/resume-examples",
      statusCode: 301,
    });
  },
});
