
import { useTranslation } from "react-i18next";
import { JobMatch } from "./types";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Building2, BriefcaseIcon, MapPin, TrendingUp, Star, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface JobListProps {
  isAnalyzing: boolean;
  matches: JobMatch[];
}

export const JobList = ({ isAnalyzing, matches }: JobListProps) => {
  const { t } = useTranslation();
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);

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
          <CardDescription>מחפש משרות מתאימות...</CardDescription>
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
      <Card className="p-6 bg-accent/5 border-accent/20">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">רוצה לראות את כל המשרות?</CardTitle>
            <CardDescription>לחץ כאן כדי לראות את כל המשרות שנמצאו בחיפוש בגוגל</CardDescription>
          </div>
          <Button 
            size="lg"
            onClick={() => window.open(matches[0].googleSearchUrl, '_blank')}
            className="gap-2"
          >
            <Search className="w-4 h-4" />
            ראה את כל המשרות בגוגל
          </Button>
        </div>
      </Card>

      <div className="grid gap-6">
        {matches.map((job) => (
          <Card 
            key={job.id} 
            className={`group transition-all duration-300 ${
              expandedJobId === job.id ? 'shadow-lg ring-2 ring-primary/10' : 'hover:shadow-md'
            }`}
          >
            <CardHeader className="cursor-pointer" onClick={() => setExpandedJobId(expandedJobId === job.id ? null : job.id)}>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="w-4 h-4" />
                    <span>{job.company}</span>
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{job.location}</span>
                  </div>
                </div>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-white ${getMatchColor(job.matchScore)}`}>
                  <Star className="w-4 h-4 mr-1" />
                  {job.matchScore}% התאמה
                </div>
              </div>
            </CardHeader>

            <CardContent className={`space-y-4 transition-all duration-300 ${
              expandedJobId === job.id ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'
            }`}>
              <p className="text-muted-foreground">{job.description}</p>
              
              <div className="flex flex-wrap gap-2">
                {job.requirements.map((req, i) => (
                  <Badge key={i} variant="secondary">{req}</Badge>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-t pt-4">
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
            </CardContent>

            <CardFooter className={`transition-all duration-300 ${
              expandedJobId === job.id ? 'opacity-100 flex gap-4' : 'opacity-0 h-0 overflow-hidden'
            }`}>
              {job.linkedinUrl && (
                <Button 
                  variant="outline"
                  className="flex-1"
                  onClick={() => window.open(job.linkedinUrl, '_blank')}
                >
                  צפה במשרה בלינקדאין
                </Button>
              )}
              <Button 
                className="flex-1"
                onClick={() => window.open(job.googleSearchUrl, '_blank')}
              >
                <Search className="w-4 h-4 mr-2" />
                חפש משרות דומות
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
