
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/use-toast";
import { JobMatch, ProfileFormData } from "./types";
import { ProfileForm } from "./ProfileForm";
import { JobList } from "./JobList";

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
    preferences: ""
  });

  const buildGoogleDorkQuery = (profile: ProfileFormData) => {
    const skills = profile.skills.split(", ").join(" OR ");
    const jobType = profile.jobType === "full-time" ? "full time" : 
                   profile.jobType === "part-time" ? "part time" : "freelance";
    
    // בניית ה-Google Dork query עם מיקום באנגלית
    const query = encodeURIComponent(`site:linkedin.com/jobs (${skills}) "${profile.location}" "${jobType}" "Israel" after:${getLastMonthDate()}`);
    return `https://www.google.com/search?q=${query}`;
  };

  const getLastMonthDate = () => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split('T')[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    
    try {
      const googleSearchUrl = buildGoogleDorkQuery(profile);
      const dummyMatches: JobMatch[] = [
        {
          id: "1",
          title: `${profile.skills.split(",")[0]} Developer`,
          company: "Tech Company",
          location: profile.location,
          matchScore: 95,
          description: `Position in ${profile.location} requiring ${profile.skills}`,
          requirements: profile.skills.split(", "),
          type: profile.jobType,
          linkedinUrl: googleSearchUrl
        }
      ];
      
      setMatches(dummyMatches);
      
      toast({
        title: "החיפוש הושלם",
        description: "נמצאו משרות מתאימות לפרופיל שלך",
        duration: 3000
      });
    } catch (error) {
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
