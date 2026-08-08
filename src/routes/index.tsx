import { createFileRoute } from "@tanstack/react-router";
import "../app/app.css";
import { LandingPage } from "../app/LandingPage";
import { useStepNavigate } from "../app/lib/navigation";

function Index() {
  const setStep = useStepNavigate();
  // FIX: removed the "mounted" gate that used to blank the entire page
  // (return null) until client JS hydrated. LandingPage only touches
  // `document` inside useEffect hooks, which never run during SSR anyway —
  // so this gate served no purpose except delaying First Contentful Paint
  // until the full JS bundle downloaded and executed. This was almost
  // certainly the main cause of the poor mobile PageSpeed score.
  return <LandingPage setStep={setStep} />;
}

const schemaMarkup = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Airesumi",
  url: "https://airesumi.com",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description: "AI-powered resume builder that creates ATS-optimized resumes tailored to any job description.",
  // FIX: removed a hardcoded aggregateRating (4.8 stars, 120 reviews) that
  // had no real review data behind it. Fabricated ratings in structured
  // data violate Google's guidelines on review markup and risk a manual
  // action or the rich-result being suppressed entirely. Add this back
  // only once there's a real review source (e.g. Trustpilot, G2) to pull
  // genuine numbers from.
});

export const Route = createFileRoute("/")({
  head: () => ({
    title: "AI Resume Builder — Free ATS-Optimized Resumes | Airesumi",
    meta: [
      {
        name: "description",
        content: "Build a professional, ATS-optimized resume in minutes using AI. Free resume builder trusted by job seekers worldwide. No sign-up required.",
      },
      {
        name: "robots",
        content: "index, follow",
      },
      {
        name: "keywords",
        content: "AI resume builder, free resume builder, ATS resume, resume maker, AI CV builder",
      },
      {
        property: "og:title",
        content: "AI Resume Builder — Free ATS-Optimized Resumes | airesumi.com",
      },
      {
        property: "og:description",
        content: "Build a professional, ATS-optimized resume in minutes using AI. Free, no sign-up required.",
      },
      {
        property: "og:url",
        content: "https://airesumi.com/",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:image",
        content: "https://airesumi.com/assets/og-image.png",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        name: "twitter:title",
        content: "AI Resume Builder — Free ATS-Optimized | airesumi.com",
      },
      {
        name: "twitter:description",
        content: "Build a professional ATS-optimized resume in minutes. Free, no sign-up required.",
      },
      {
        name: "twitter:url",
        content: "https://airesumi.com/",
      },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://airesumi.com/",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: schemaMarkup,
      },
    ],
  }),
  component: Index,
});
