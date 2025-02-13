
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
    <div className={`min-h-screen bg-gradient-to-b from-[#F2FCE2] to-white ${isRTL ? 'font-heebo' : ''}`}>
      <section className="container max-w-6xl mx-auto pt-24 pb-12">
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-[#8B5CF6]">
            {t('jobs.title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('jobs.description')}
          </p>
        </div>
      </section>

      <section className="container max-w-6xl mx-auto py-8">
        <JobMatcher />
      </section>

      <section className="py-16 bg-white/50 backdrop-blur-sm mt-12">
        <div className="container max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="group glass p-8 rounded-2xl hover:shadow-lg transition-all duration-300 animate-fade-up"
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
    </div>
  );
};

export default Jobs;
