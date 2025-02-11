
import { useTranslation } from "react-i18next";
import { JobMatch } from "./types";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Building2, BriefcaseIcon, MapPin, TrendingUp, Star, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface JobListProps {
  isAnalyzing: boolean;
  matches: JobMatch[];
}

export const JobList = ({ isAnalyzing, matches }: JobListProps) => {
  const { t } = useTranslation();

  const getMatchColor = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 80) return "bg-yellow-500";
    return "bg-orange-500";
  };

  if (isAnalyzing) {
    return (
      <Card className="p-8">
        <div className="space-y-4 text-center">
          <CardTitle>{t("jobs.matcher.analyzing")}</CardTitle>
          <Progress value={45} className="w-full" />
        </div>
      </Card>
    );
  }

  if (matches.length === 0) {
    return (
      <Card className="p-8 text-center">
        <CardTitle className="mb-2">{t("jobs.matcher.noMatches")}</CardTitle>
        <CardDescription>{t("jobs.matcher.fillProfile")}</CardDescription>
      </Card>
    );
  }

  return (
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

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
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

                <Button 
                  className="mt-4"
                  onClick={() => window.open(job.linkedinUrl, '_blank')}
                >
                  <Search className="w-4 h-4 mr-2" />
                  חפש משרות בגוגל
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
