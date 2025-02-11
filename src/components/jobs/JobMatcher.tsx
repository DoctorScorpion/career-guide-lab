
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    
    try {
      // קודם כל נחפש בדאטהבייס עם full-text search
      const searchQuery = profile.skills.split(',').join(' ') + ' ' + profile.location;
      
      const { data: dbJobs, error: dbError } = await supabase
        .from('jobs')
        .select('*')
        .textSearch('fts', `'${searchQuery}'`)
        .order('match_score', { ascending: false })
        .limit(15);

      if (dbError) throw dbError;

      // אם לא מצאנו מספיק תוצאות, נחפש גם בלינקדאין
      if (!dbJobs || dbJobs.length < 5) {
        const { data: externalData, error } = await supabase.functions.invoke('search-jobs', {
          body: {
            skills: profile.skills.split(", "),
            location: profile.location,
            jobType: profile.jobType,
            timeRange: profile.timeRange
          }
        });

        if (error) throw error;

        // נמזג את התוצאות
        const mappedDbJobs = (dbJobs || []).map(mapDbJobToJobMatch);
        const allJobs = [...mappedDbJobs, ...externalData.jobs];
        const uniqueJobs = Array.from(new Map(allJobs.map(job => [job.id, job])).values());
        setMatches(uniqueJobs);

        toast({
          title: "החיפוש הושלם",
          description: `נמצאו ${uniqueJobs.length} משרות מתאימות`,
          duration: 3000
        });
      } else {
        setMatches(dbJobs.map(mapDbJobToJobMatch));
        toast({
          title: "החיפוש הושלם",
          description: `נמצאו ${dbJobs.length} משרות מתאימות מהמאגר שלנו`,
          duration: 3000
        });
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
