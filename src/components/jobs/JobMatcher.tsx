
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/use-toast";
import { JobMatch, ProfileFormData } from "./types";
import { ProfileForm } from "./ProfileForm";
import { JobList } from "./JobList";
import { supabase } from "@/integrations/supabase/client";

export const JobMatcher = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'he';
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [matches, setMatches] = useState<JobMatch[]>([]);
  const [profile, setProfile] = useState<ProfileFormData>({
    skills: "",
    experience: "",
    jobType: "",
    location: "",
    preferences: "",
    timeRange: "last-month"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    
    try {
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('search-jobs', {
        body: {
          skills: profile.skills.split(", "),
          location: profile.location,
          jobType: profile.jobType,
          timeRange: profile.timeRange
        }
      });

      if (error) throw error;

      // Transform the jobs data to match our JobMatch type
      const jobMatches: JobMatch[] = data.jobs.map((job: any) => ({
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        matchScore: job.match_score,
        description: job.description,
        requirements: job.requirements,
        type: job.job_type,
        salary: job.salary,
        linkedinUrl: job.linkedin_url,
        googleSearchUrl: job.source_url
      }));

      setMatches(jobMatches);
      
      toast({
        title: "החיפוש הושלם",
        description: `נמצאו ${jobMatches.length} משרות מתאימות לפרופיל שלך`,
        duration: 3000
      });
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בחיפוש המשרות",
        variant: "destructive",
        duration: 3000
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="container max-w-6xl mx-auto px-4">
      <div className="grid md:grid-cols-[400px_1fr] gap-8">
        <ProfileForm
          profile={profile}
          setProfile={setProfile}
          onSubmit={handleSubmit}
          isAnalyzing={isAnalyzing}
        />
        <JobList
          isAnalyzing={isAnalyzing}
          matches={matches}
        />
      </div>
    </div>
  );
};
