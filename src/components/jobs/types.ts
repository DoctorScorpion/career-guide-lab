
export interface JobMatch {
  id: string;
  title: string;
  company: string;
  location: string;
  matchScore: number;
  description: string;
  requirements: string[];
  type: string;
  salary?: string;
  linkedinUrl?: string;
  googleSearchUrl?: string;
}

export type TimeRange = "all-time" | "last-month" | "last-week" | "last-day";

export interface ProfileFormData {
  skills: string;
  experience: string;
  jobType: string;
  location: string;
  preferences: string;
  timeRange: TimeRange;
}
