
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
    
    return encodeURIComponent(`site:linkedin.com/jobs (${skills}) "${profile.location}" "${jobType}" "Israel" after:${getLastMonthDate()}`);
  };

  const getLastMonthDate = () => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split('T')[0];
  };

  const generateDummyMatches = (profile: ProfileFormData): JobMatch[] => {
    const skills = profile.skills.split(", ");
    const baseSearchUrl = `https://www.google.com/search?q=${buildGoogleDorkQuery(profile)}`;
    
    return [
      {
        id: "1",
        title: `Senior ${skills[0]} Developer`,
        company: "Tech Innovations Ltd",
        location: profile.location,
        matchScore: 95,
        description: `We are seeking an experienced ${skills[0]} developer to join our growing team in ${profile.location}. The ideal candidate will have strong expertise in ${skills.slice(0, 3).join(", ")}.`,
        requirements: skills,
        type: profile.jobType,
        salary: "₪35,000 - ₪45,000",
        linkedinUrl: baseSearchUrl
      },
      {
        id: "2",
        title: `${skills[0]} Team Lead`,
        company: "StartUp Nation Co",
        location: profile.location,
        matchScore: 88,
        description: `Leading startup looking for a talented Team Lead with ${skills[0]} expertise. Position based in ${profile.location} with hybrid work options.`,
        requirements: skills.slice(0, 4),
        type: profile.jobType,
        salary: "₪40,000 - ₪50,000",
        linkedinUrl: baseSearchUrl
      },
      {
        id: "3",
        title: `${skills[0]} Solution Architect`,
        company: "Enterprise Systems",
        location: profile.location,
        matchScore: 82,
        description: `Join our enterprise solutions team as a Solution Architect specializing in ${skills[0]}. Work from our ${profile.location} office.`,
        requirements: skills.slice(1, 5),
        type: profile.jobType,
        salary: "₪45,000 - ₪55,000",
        linkedinUrl: baseSearchUrl
      }
    ];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    
    try {
      const dummyMatches = generateDummyMatches(profile);
      setMatches(dummyMatches);
      
      toast({
        title: "החיפוש הושלם",
        description: `נמצאו ${dummyMatches.length} משרות מתאימות לפרופיל שלך`,
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
