
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

export type TimeRange = "24h" | "week" | "last-month" | "three-months";

export interface ProfileFormData {
  skills: string;
  experience: string;
  jobType: string;
  location: string;
  preferences: string;
  timeRange: TimeRange;
}
