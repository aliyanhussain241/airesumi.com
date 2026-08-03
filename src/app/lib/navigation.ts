import { useNavigate } from "@tanstack/react-router";
import { Step } from "../App";

export const stepToPath: Record<number, string> = {
  [Step.LANDING]: "/",
  [Step.DETAILS]: "/resume",
  [Step.DESIGN]: "/resume",
  [Step.JOB]: "/resume",
  [Step.GENERATING]: "/resume",
  [Step.DONE]: "/resume",
  [Step.COVER_LETTER]: "/cover-letter",
  [Step.BLOG]: "/blog",
  [Step.PREMIUM]: "/premium",
  [Step.SALARY_ANALYZER]: "/salary-analyzer",
  [Step.INTERVIEW_PREP]: "/interview-prep",
  [Step.RESUME_EXAMPLES]: "/resume-examples",
  [Step.ABOUT]: "/about",
  [Step.CONTACT]: "/contact",
  [Step.PRIVACY]: "/privacy",
  [Step.TERMS]: "/terms",
  [Step.ATS_CHECKER]: "/ats-resume-checker",
};

/**
 * Returns a `setStep`-compatible function that navigates to the URL
 * associated with the given Step. Used as a drop-in replacement for
 * the old internal step switcher on top-level pages.
 */
export function useStepNavigate() {
  const navigate = useNavigate();
  return (step: number) => {
    const path = stepToPath[step] ?? "/";
    navigate({ to: path });
  };
}
