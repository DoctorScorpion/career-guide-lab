
import { JobMatcher } from "@/components/jobs/JobMatcher";
import { useTranslation } from "react-i18next";
import { BadgeCheck, Target, Sparkles } from "lucide-react";

const Jobs = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'he';

  const values = [
    {
      icon: Target,
      title: t('values.items.personal.title'),
      description: t('values.items.personal.description')
    },
    {
      icon: BadgeCheck,
      title: t('values.items.professional.title'),
      description: t('values.items.professional.description')
    },
    {
      icon: Sparkles,
      title: t('values.items.innovation.title'),
      description: t('values.items.innovation.description')
    }
  ];

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'font-heebo' : ''}`}>
      <section className="pt-24 pb-16 bg-gradient-to-b from-accent/5 to-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-up">
            <h1 className="font-display text-4xl font-medium">
              {t('jobs.title')}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t('jobs.description')}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-secondary/30">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="group bg-background p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <value.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-medium mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
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
