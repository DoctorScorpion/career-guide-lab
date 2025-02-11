import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
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
import { ProfileFormData } from "./types";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

// רשימת הכישורים מלינankedאין
const linkedinSkills = [
  "JavaScript", "React", "Node.js", "Python", "Java", "C++", "SQL",
  "Product Management", "Project Management", "Marketing", "Sales",
  "Business Development", "Data Analysis", "UX Design", "UI Design",
  "Content Writing", "Digital Marketing", "SEO", "Social Media",
  "Customer Service", "Leadership", "Team Management", "Agile",
  "Scrum", "DevOps", "Cloud Computing", "AWS", "Azure", "Google Cloud",
  "Machine Learning", "AI", "Data Science", "Business Intelligence",
  "HR Management", "Recruitment", "Training & Development"
];

// אזורים בישראל באנגלית כמו בלינankedאין
const israelRegions = [
  "Northern Israel",
  "Haifa",
  "Sharon",
  "Central Israel",
  "Tel Aviv",
  "Jerusalem",
  "Shephelah",
  "Southern Israel"
];

interface ProfileFormProps {
  profile: ProfileFormData;
  setProfile: (profile: ProfileFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  isAnalyzing: boolean;
}

export const ProfileForm = ({ profile, setProfile, onSubmit, isAnalyzing }: ProfileFormProps) => {
  const { t } = useTranslation();
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const handleSkillSelect = (skill: string) => {
    const updatedSkills = selectedSkills.includes(skill)
      ? selectedSkills.filter(s => s !== skill)
      : [...selectedSkills, skill];
    
    setSelectedSkills(updatedSkills);
    setProfile({ ...profile, skills: updatedSkills.join(", ") });
  };

  return (
    <Card className="h-fit sticky top-24">
      <CardHeader>
        <CardTitle>{t("jobs.matcher.profile.title")}</CardTitle>
        <CardDescription>{t("jobs.matcher.profile.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>{t("jobs.matcher.profile.skills")}</Label>
            <div className="max-h-40 overflow-y-auto p-2 border rounded-lg space-y-2">
              <div className="flex flex-wrap gap-2">
                {linkedinSkills.map((skill) => (
                  <Badge
                    key={skill}
                    variant={selectedSkills.includes(skill) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleSkillSelect(skill)}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>{t("jobs.matcher.profile.experience")}</Label>
            <Textarea
              placeholder={t("jobs.matcher.profile.experiencePlaceholder")}
              value={profile.experience}
              onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>{t("jobs.matcher.profile.jobType")}</Label>
            <Select
              value={profile.jobType}
              onValueChange={(value) => setProfile({ ...profile, jobType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("jobs.matcher.profile.jobTypePlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">משרה מלאה</SelectItem>
                <SelectItem value="part-time">משרה חלקית</SelectItem>
                <SelectItem value="freelance">פרילנס</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t("jobs.matcher.profile.location")}</Label>
            <Select
              value={profile.location}
              onValueChange={(value) => setProfile({ ...profile, location: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("jobs.matcher.profile.locationPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {israelRegions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t("jobs.matcher.profile.preferences")}</Label>
            <Textarea
              placeholder={t("jobs.matcher.profile.preferencesPlaceholder")}
              value={profile.preferences}
              onChange={(e) => setProfile({ ...profile, preferences: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>טווח זמן לחיפוש</Label>
            <Select
              value={profile.timeRange}
              onValueChange={(value) => setProfile({ ...profile, timeRange: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="בחר טווח זמן" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">24 שעות אחרונות</SelectItem>
                <SelectItem value="week">שבוע אחרון</SelectItem>
                <SelectItem value="last-month">חודש אחרון</SelectItem>
                <SelectItem value="three-months">3 חודשים אחרונים</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={isAnalyzing}>
            {isAnalyzing ? t("jobs.matcher.analyzing") : t("jobs.matcher.analyze")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
