
import { useState, useEffect } from "react";
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
    skills: "Cloud, Security",  // ערכי ברירת מחדל
    experience: "",
    jobType: "",
    location: "Central Israel",  // ערך ברירת מחדל
    preferences: "",
    timeRange: "last-month"
  });

  const mapDbJobToJobMatch = (dbJob: any): JobMatch => ({
    id: dbJob.id,
    title: dbJob.title,
    company: dbJob.company,
    location: dbJob.location,
    matchScore: dbJob.match_score || 0,
    description: dbJob.description || "",
    requirements: dbJob.requirements || [],
    type: dbJob.job_type,
    salary: dbJob.salary,
    linkedinUrl: dbJob.linkedin_url,
    googleSearchUrl: dbJob.source_url
  });

  const searchJobs = async (searchProfile: ProfileFormData) => {
    setIsAnalyzing(true);
    
    try {
      console.log('Submitting search with profile:', searchProfile);
      const { data: externalData, error } = await supabase.functions.invoke('search-jobs', {
        body: {
          skills: searchProfile.skills.split(", "),
          location: searchProfile.location,
          jobType: searchProfile.jobType,
          timeRange: searchProfile.timeRange
        }
      });

      if (error) throw error;

      if (!externalData?.jobs || externalData.jobs.length === 0) {
        toast({
          title: "לא נמצאו תוצאות",
          description: "נסה לשנות את פרמטרי החיפוש",
          variant: "destructive",
          duration: 3000
        });
        setMatches([]);
      } else {
        setMatches(externalData.jobs);
        if (!searchProfile.isInitialSearch) {  // רק אם זה לא החיפוש ההתחלתי
          toast({
            title: "החיפוש הושלם",
            description: `נמצאו ${externalData.jobs.length} משרות מתאימות`,
            duration: 3000
          });
        }
      }
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

  // חיפוש התחלתי כשהדף נטען
  useEffect(() => {
    searchJobs({ ...profile, isInitialSearch: true });
  }, []);  // רץ רק פעם אחת כשהקומפוננטה נטענת

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await searchJobs(profile);
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
