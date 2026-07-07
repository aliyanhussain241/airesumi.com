import { CoverLetterData, JobDescription, ResumeData, UserData } from "./types";
import { supabase } from "@/integrations/supabase/client";

// ✅ Helper — attach auth token on every request.
async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}



export async function generateOptimizedResume(
  userData: UserData,
  jobData: JobDescription,
  onStatusUpdate: (status: string) => void,
  token?: string
): Promise<ResumeData> {
  onStatusUpdate("Analyzing job description and extracting keywords...");
  try {
    const headers = await getAuthHeaders();
    const response = await fetch("/api/generate-resume", {
      method: "POST",
      headers,
      body: JSON.stringify({ userData, jobData }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to generate resume");
    }
    onStatusUpdate("Finalizing formatting...");
    const parsedData = await response.json() as ResumeData;
    return parsedData;
  } catch (error: any) {
    console.error("Failed to generate resume:", error);
    throw new Error(error.message || "Failed to generate resume. Please try again.");
  }
}

export async function generateCoverLetter(
  userData: UserData,
  jobData: JobDescription,
  tone: string,
  onStatusUpdate: (status: string) => void
): Promise<CoverLetterData> {
  onStatusUpdate("Analyzing background against job requirements...");
  try {
    const headers = await getAuthHeaders();
    const response = await fetch("/api/generate-cover-letter", {
      method: "POST",
      headers,
      body: JSON.stringify({ userData, jobData, tone }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to generate cover letter");
    }
    onStatusUpdate("Finalizing insights...");
    const parsedData = await response.json() as CoverLetterData;
    return parsedData;
  } catch (error: any) {
    console.error("Failed to generate cover letter:", error);
    throw new Error(error.message || "Failed to generate cover letter. Please try again.");
  }
}
