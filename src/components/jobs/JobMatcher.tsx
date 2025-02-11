
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/use-toast";
import { JobMatch, ProfileFormData } from "./types";
import { ProfileForm } from "./ProfileForm";
import { JobList } from "./JobList";

// מידע לדוגמה - במציאות יגיע מה-API
const mockMatches: JobMatch[] = [
  {
    id: "1",
    title: "Full Stack Developer",
    company: "TechCo",
    location: "תל אביב",
    matchScore: 95,
    description: "אנחנו מחפשים מפתח/ת Full Stack עם ניסיון ב-React ו-Node.js",
    requirements: ["React", "Node.js", "TypeScript", "3+ years experience"],
    type: "משרה מלאה",
    salary: "32-42K"
  },
  {
    id: "2",
    title: "Frontend Team Lead",
    company: "StartUp IL",
    location: "הרצליה",
    matchScore: 88,
    description: "דרוש/ה מוביל/ת צוות Frontend עם ניסיון בבניית מוצרים מורכבים",
    requirements: ["React", "Team Leadership", "5+ years experience"],
    type: "משרה מלאה",
    salary: "45-55K"
  },
  {
    id: "3",
    title: "Backend Developer",
    company: "Enterprise Solutions",
    location: "רמת גן",
    matchScore: 82,
    description: "מפתח/ת Backend לעבודה על מערכות בקנה מידה גדול",
    requirements: ["Java", "Spring", "Microservices", "4+ years experience"],
    type: "משרה מלאה"
  }
];

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    
    try {
      // כאן יהיה בעתיד קריאה ל-API להתאמת משרות
      await new Promise(resolve => setTimeout(resolve, 2000)); // סימולציה של קריאת API
      setMatches(mockMatches);
      
      toast({
        title: "הניתוח הושלם",
        description: "נמצאו משרות מתאימות לפרופיל שלך",
        duration: 3000
      });
    } catch (error) {
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בניתוח הפרופיל",
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
