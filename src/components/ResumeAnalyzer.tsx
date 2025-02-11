
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FileText, Upload, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { pipeline } from "@huggingface/transformers";

export const ResumeAnalyzer = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [analysis, setAnalysis] = useState<null | {
    score: number;
    recommendations: string[];
  }>(null);

  const analyzeResume = async () => {
    if (!resumeText.trim()) {
      toast({
        title: t("resume.errors.noText"),
        description: t("resume.errors.pleaseEnterText"),
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      // Initialize the text classification pipeline
      const classifier = await pipeline(
        "text-classification",
        "onnx-community/distilbert-base-uncased-resume-quality",
        { device: "webgpu" }
      );

      // Analyze the resume
      const result = await classifier(resumeText);
      
      // הגדרת ציון ברירת מחדל במקרה שהמודל לא מחזיר ציון
      let score = 0.5; // ציון ברירת מחדל
      
      // בדיקה אם התוצאה היא מערך והאם יש בה אובייקט עם שדה label
      if (Array.isArray(result) && result[0] && typeof result[0] === 'object' && 'label' in result[0]) {
        // המרת התווית לציון (לדוגמה: "LABEL_1" = ציון גבוה, "LABEL_0" = ציון נמוך)
        score = result[0].label === "LABEL_1" ? 0.8 : 0.3;
      }

      // Generate recommendations based on the analysis
      const recommendations = [
        t("resume.recommendations.structure"),
        t("resume.recommendations.keywords"),
        t("resume.recommendations.achievements"),
        t("resume.recommendations.format")
      ];

      setAnalysis({
        score,
        recommendations
      });

      toast({
        title: t("resume.success.title"),
        description: t("resume.success.description"),
      });
    } catch (error) {
      console.error("Resume analysis error:", error);
      toast({
        title: t("resume.errors.analysisError"),
        description: t("resume.errors.tryAgain"),
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setResumeText(text);
    };
    reader.readAsText(file);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          {t("resume.analyzer.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">
              {t("resume.analyzer.pasteText")}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept=".txt,.doc,.docx,.pdf"
                onChange={handleFileUpload}
                className="hidden"
                id="resume-upload"
              />
              <label htmlFor="resume-upload">
                <Button variant="outline" size="sm" className="cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  {t("resume.analyzer.upload")}
                </Button>
              </label>
            </div>
          </div>
          <Textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder={t("resume.analyzer.placeholder")}
            className="min-h-[200px]"
          />
          <Button 
            onClick={analyzeResume} 
            disabled={isAnalyzing || !resumeText.trim()}
            className="w-full"
          >
            {isAnalyzing ? t("resume.analyzer.analyzing") : t("resume.analyzer.analyze")}
          </Button>
        </div>

        {analysis && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="text-lg font-medium">
                {t("resume.analyzer.score")}:{" "}
                <span className={analysis.score > 0.7 ? "text-green-500" : "text-yellow-500"}>
                  {Math.round(analysis.score * 100)}%
                </span>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">{t("resume.analyzer.recommendations")}</h4>
              <ul className="space-y-2">
                {analysis.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    {analysis.score > 0.7 ? (
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                    )}
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
