
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
import { ProfileFormData } from "./types";

interface ProfileFormProps {
  profile: ProfileFormData;
  setProfile: (profile: ProfileFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  isAnalyzing: boolean;
}

export const ProfileForm = ({ profile, setProfile, onSubmit, isAnalyzing }: ProfileFormProps) => {
  const { t } = useTranslation();

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
            <Textarea
              placeholder={t("jobs.matcher.profile.skillsPlaceholder")}
              value={profile.skills}
              onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
            />
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
            <Input
              placeholder={t("jobs.matcher.profile.locationPlaceholder")}
              value={profile.location}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>{t("jobs.matcher.profile.preferences")}</Label>
            <Textarea
              placeholder={t("jobs.matcher.profile.preferencesPlaceholder")}
              value={profile.preferences}
              onChange={(e) => setProfile({ ...profile, preferences: e.target.value })}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isAnalyzing}>
            {isAnalyzing ? t("jobs.matcher.analyzing") : t("jobs.matcher.analyze")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
