
import { JobMatcher } from "@/components/jobs/JobMatcher";
import { useTranslation } from "react-i18next";

const Jobs = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'he';

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'font-heebo' : ''}`}>
      <section className="pt-24 pb-16 bg-gradient-to-b from-accent/5 to-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-up">
            <h1 className="font-display text-4xl font-medium">
              {t('jobs.title') || "מצא את המשרה המושלמת"}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t('jobs.description') || "המערכת החכמה שלנו תעזור לך למצוא את המשרה המתאימה ביותר עבורך"}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <JobMatcher />
      </section>
    </div>
  );
};

export default Jobs;
