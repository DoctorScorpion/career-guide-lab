
export interface SearchParams {
  skills: string[];
  location: string;
  jobType: string;
  timeRange: string;
}

export interface JobDetails {
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  url: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  job_type: string;
  skills: string[];
  match_score: number;
  source_url: string;
  linkedin_url: string;
}
