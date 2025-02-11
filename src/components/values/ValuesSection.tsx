
import { useTranslation } from "react-i18next";
import { Heart, Star, Briefcase } from "lucide-react";

export const ValuesSection = () => {
  const { t } = useTranslation();

  return (
    <section className="py-16 bg-background">
      <div className="container">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="font-display text-3xl">{t("values.title")}</h2>
          <p className="text-muted-foreground">
            {t("values.description")}
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              key: 'personal',
              icon: Heart,
              title: t("values.items.personal.title"),
              description: t("values.items.personal.description")
            },
            {
              key: 'professional',
              icon: Star,
              title: t("values.items.professional.title"),
              description: t("values.items.professional.description")
            },
            {
              key: 'innovation',
              icon: Briefcase,
              title: t("values.items.innovation.title"),
              description: t("values.items.innovation.description")
            },
          ].map((value, i) => (
            <div
              key={value.key}
              className="group p-8 bg-secondary rounded-2xl transition-all hover:shadow-lg animate-fade-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <value.icon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-display text-xl mb-3">
                {value.title}
              </h3>
              <p className="text-muted-foreground">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
