import { createFileRoute, redirect } from "@tanstack/react-router";

// Consolidated into /ats-resume-checker to remove keyword cannibalization.
// Permanent (301) redirect keeps existing traffic, bookmarks, and backlinks working.
export const Route = createFileRoute("/ats-checker")({
  beforeLoad: () => {
    throw redirect({ to: "/ats-resume-checker", statusCode: 301 });
  },
});
