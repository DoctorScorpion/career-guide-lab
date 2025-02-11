
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Star, Lightbulb } from "lucide-react";

const About = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'he';

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'font-heebo' : ''}`}>
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-accent/5 to-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-up">
            <h1 className="font-display text-4xl font-medium">
              {t('about.title')}
            </h1>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="container">
          <Card className="bg-muted border-none">
            <CardHeader>
              <CardTitle className="text-2xl font-display">
                {t('about.story.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t('about.story.content')}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-secondary">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="font-display text-3xl">{t('about.mission.title')}</h2>
            <p className="text-muted-foreground">{t('about.mission.content')}</p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="container">
          <h2 className="font-display text-3xl text-center mb-12">
            {t('about.values.title')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { key: 'innovation', icon: Lightbulb },
              { key: 'personal', icon: Heart },
              { key: 'professional', icon: Star },
            ].map((value) => (
              <div
                key={value.key}
                className="p-8 bg-muted rounded-2xl text-center animate-fade-up"
              >
                <div className="w-12 h-12 bg-accent/10 rounded-full mx-auto flex items-center justify-center mb-6">
                  <value.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-display text-xl mb-4">
                  {t(`about.values.items.${value.key}`)}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
