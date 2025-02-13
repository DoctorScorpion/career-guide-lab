
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
import { Building2, BriefcaseIcon, MapPin, TrendingUp, Star, Search, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface JobListProps {
  isAnalyzing: boolean;
  matches: JobMatch[];
}

export const JobList = ({ isAnalyzing, matches }: JobListProps) => {
  const { t } = useTranslation();
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);

  const getMatchColor = (score: number) => {
    if (score >= 90) return "bg-gradient-to-r from-[#8B5CF6] to-[#6366F1]";
    if (score >= 80) return "bg-gradient-to-r from-[#10B981] to-[#059669]";
    return "bg-gradient-to-r from-[#F59E0B] to-[#D97706]";
  };

  if (isAnalyzing) {
    return (
      <Card className="p-8 bg-white/80 backdrop-blur-sm border-accent/20">
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
      <Card className="p-8 text-center bg-white/80 backdrop-blur-sm border-accent/20">
        <CardTitle className="mb-2">{t("jobs.matcher.noMatches")}</CardTitle>
        <CardDescription>{t("jobs.matcher.fillProfile")}</CardDescription>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-r from-[#F2FCE2]/50 to-white border-accent/20">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">נמצאו {matches.length} משרות מתאימות</CardTitle>
            <CardDescription>המשרות מדורגות לפי התאמה אישית</CardDescription>
          </div>
          <Button 
            size="lg"
            onClick={() => window.open(matches[0].googleSearchUrl, '_blank')}
            className="gap-2 bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] hover:from-[#7C3AED] hover:to-[#4F46E5] transition-all duration-300"
          >
            <Search className="w-4 h-4" />
            חפש משרות נוספות
          </Button>
        </div>
      </Card>

      <ScrollArea className="h-[600px] rounded-lg">
        <div className="grid gap-4">
          {matches.map((job) => (
            <Card 
              key={job.id} 
              className={`group transition-all duration-300 border-accent/10 hover:border-accent/30 ${
                expandedJobId === job.id ? 'shadow-lg ring-1 ring-accent/20 bg-white' : 'hover:shadow-md bg-white/80'
              }`}
            >
              <CardHeader 
                className="cursor-pointer select-none" 
                onClick={() => setExpandedJobId(expandedJobId === job.id ? null : job.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-xl">{job.title}</CardTitle>
                      {expandedJobId !== job.id ? (
                        <ChevronDown className="w-5 h-5 text-muted-foreground animate-bounce" />
                      ) : (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-muted-foreground text-sm">
                      <div className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        <span>{job.company}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                      </div>
                    </div>
                  </div>
                  <div 
                    className={`inline-flex items-center px-3 py-1 rounded-full text-white ${getMatchColor(job.matchScore)} shadow-sm`}
                  >
                    <Star className="w-4 h-4 mr-1" />
                    {job.matchScore}% התאמה
                  </div>
                </div>
              </CardHeader>

              <CardContent 
                className={`space-y-4 transition-all duration-300 ${
                  expandedJobId === job.id ? 'opacity-100 max-h-[500px]' : 'opacity-0 max-h-0 overflow-hidden'
                }`}
              >
                <p className="text-muted-foreground whitespace-pre-line">{job.description}</p>
                
                {job.requirements && job.requirements.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">דרישות התפקיד:</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.requirements.map((req, i) => (
                        <Badge 
                          key={i} 
                          variant="secondary"
                          className="bg-accent/10 hover:bg-accent/20 text-accent-foreground transition-colors"
                        >
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

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

              <CardFooter 
                className={`transition-all duration-300 ${
                  expandedJobId === job.id ? 'opacity-100 flex gap-4' : 'opacity-0 h-0 overflow-hidden'
                }`}
              >
                {job.linkedinUrl && (
                  <Button 
                    variant="outline"
                    className="flex-1 border-accent/20 hover:bg-accent/5 transition-colors"
                    onClick={() => window.open(job.linkedinUrl, '_blank')}
                  >
                    צפה במשרה בלינקדאין
                  </Button>
                )}
                <Button 
                  className="flex-1 bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] hover:from-[#7C3AED] hover:to-[#4F46E5] transition-all duration-300"
                  onClick={() => window.open(job.googleSearchUrl || job.linkedinUrl, '_blank')}
                >
                  <Search className="w-4 h-4 mr-2" />
                  חפש משרות דומות
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
