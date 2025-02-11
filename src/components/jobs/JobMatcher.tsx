
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Building2, BriefcaseIcon, MapPin, TrendingUp, Star } from "lucide-react";

interface JobMatch {
  id: string;
  title: string;
  company: string;
  location: string;
  matchScore: number;
  description: string;
  requirements: string[];
  type: string;
  salary?: string;
}

export const JobMatcher = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'he';
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [matches, setMatches] = useState<JobMatch[]>([]);
  const [profile, setProfile] = useState({
    skills: "",
    experience: "",
    jobType: "",
    location: "",
    preferences: ""
  });

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

  const getMatchColor = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 80) return "bg-yellow-500";
    return "bg-orange-500";
  };

  return (
    <div className="container max-w-6xl mx-auto px-4">
      <div className="grid md:grid-cols-[400px_1fr] gap-8">
        {/* טופס פרופיל */}
        <Card className="h-fit sticky top-24">
          <CardHeader>
            <CardTitle>{t("jobs.matcher.profile.title") || "פרופיל מקצועי"}</CardTitle>
            <CardDescription>
              {t("jobs.matcher.profile.description") || "מלא/י את הפרטים לקבלת התאמות מדויקות"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>{t("jobs.matcher.profile.skills") || "מיומנויות"}</Label>
                <Textarea
                  placeholder={t("jobs.matcher.profile.skillsPlaceholder") || "פרט/י את המיומנויות המקצועיות שלך"}
                  value={profile.skills}
                  onChange={(e) => setProfile(prev => ({ ...prev, skills: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label>{t("jobs.matcher.profile.experience") || "ניסיון"}</Label>
                <Textarea
                  placeholder={t("jobs.matcher.profile.experiencePlaceholder") || "תאר/י את הניסיון המקצועי שלך"}
                  value={profile.experience}
                  onChange={(e) => setProfile(prev => ({ ...prev, experience: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>{t("jobs.matcher.profile.jobType") || "סוג משרה"}</Label>
                <Select
                  value={profile.jobType}
                  onValueChange={(value) => setProfile(prev => ({ ...prev, jobType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("jobs.matcher.profile.jobTypePlaceholder") || "בחר/י סוג משרה"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">משרה מלאה</SelectItem>
                    <SelectItem value="part-time">משרה חלקית</SelectItem>
                    <SelectItem value="freelance">פרילנס</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t("jobs.matcher.profile.location") || "מיקום"}</Label>
                <Input
                  placeholder={t("jobs.matcher.profile.locationPlaceholder") || "איזור מועדף"}
                  value={profile.location}
                  onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>{t("jobs.matcher.profile.preferences") || "העדפות נוספות"}</Label>
                <Textarea
                  placeholder={t("jobs.matcher.profile.preferencesPlaceholder") || "העדפות נוספות כמו תרבות ארגונית, תנאים וכו'"}
                  value={profile.preferences}
                  onChange={(e) => setProfile(prev => ({ ...prev, preferences: e.target.value }))}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isAnalyzing}>
                {isAnalyzing ? 
                  t("jobs.matcher.analyzing") || "מנתח התאמות..." : 
                  t("jobs.matcher.analyze") || "מצא משרות מתאימות"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* רשימת התאמות */}
        <div className="space-y-6">
          {isAnalyzing ? (
            <Card className="p-8">
              <div className="space-y-4 text-center">
                <CardTitle>{t("jobs.matcher.analyzing") || "מנתח את הפרופיל שלך"}</CardTitle>
                <Progress value={45} className="w-full" />
              </div>
            </Card>
          ) : matches.length > 0 ? (
            <div className="space-y-6">
              {matches.map((job) => (
                <Card key={job.id} className="group hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-4 flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-semibold mb-1">{job.title}</h3>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Building2 className="w-4 h-4" />
                              <span>{job.company}</span>
                              <MapPin className="w-4 h-4 mr-2" />
                              <span>{job.location}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-white ${getMatchColor(job.matchScore)}`}>
                              <Star className="w-4 h-4 mr-1" />
                              {job.matchScore}% התאמה
                            </div>
                          </div>
                        </div>

                        <p className="text-muted-foreground">{job.description}</p>
                        
                        <div className="flex flex-wrap gap-2">
                          {job.requirements.map((req, i) => (
                            <Badge key={i} variant="secondary">{req}</Badge>
                          ))}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <BriefcaseIcon className="w-4 h-4" />
                            {job.type}
                          </div>
                          {job.salary && (
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-4 h-4" />
                              {job.salary}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <CardTitle className="mb-2">
                {t("jobs.matcher.noMatches") || "טרם נמצאו התאמות"}
              </CardTitle>
              <CardDescription>
                {t("jobs.matcher.fillProfile") || "מלא/י את פרטי הפרופיל כדי לקבל התאמות"}
              </CardDescription>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
