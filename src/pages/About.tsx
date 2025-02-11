
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Star, Lightbulb, Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const About = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'he';

  const teamMembers = [
    {
      name: "עמית בקשי",
      nameEn: "Amit Bakshi",
      role: "מייסד ומנכ״ל",
      roleEn: "Founder & CEO",
      image: "/placeholder.svg",
      quote: "כל אדם ראוי לקריירה מספקת ומשמעותית",
      quoteEn: "Everyone deserves a fulfilling and meaningful career",
    },
    {
      name: "שירה כהן",
      nameEn: "Shira Cohen",
      role: "מנהלת גיוס בכירה",
      roleEn: "Senior Recruitment Manager",
      image: "/placeholder.svg",
      quote: "הצלחה היא מציאת ההתאמה המושלמת",
      quoteEn: "Success is finding the perfect match",
    },
    {
      name: "דן לוי",
      nameEn: "Dan Levy",
      role: "יועץ קריירה ראשי",
      roleEn: "Head Career Consultant",
      image: "/placeholder.svg",
      quote: "פיתוח קריירה הוא מסע של צמיחה",
      quoteEn: "Career development is a journey of growth",
    },
  ];

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
            <CardContent className="space-y-6">
              <div className="aspect-video w-full rounded-lg overflow-hidden bg-accent/5">
                <img
                  src="/placeholder.svg"
                  alt="Office"
                  className="w-full h-full object-cover"
                />
              </div>
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
            <div className="relative">
              <Quote className="w-12 h-12 text-accent/20 absolute -top-6 -left-6" />
              <p className="text-muted-foreground text-lg italic relative z-10">
                {t('about.mission.content')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container">
          <h2 className="font-display text-3xl text-center mb-12">
            {i18n.language === 'he' ? 'הצוות שלנו' : 'Our Team'}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div key={member.name} className="text-center space-y-4">
                <Avatar className="w-24 h-24 mx-auto">
                  <AvatarImage src={member.image} alt={i18n.language === 'he' ? member.name : member.nameEn} />
                  <AvatarFallback>{member.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-display text-xl">
                    {i18n.language === 'he' ? member.name : member.nameEn}
                  </h3>
                  <p className="text-muted-foreground">
                    {i18n.language === 'he' ? member.role : member.roleEn}
                  </p>
                </div>
                <blockquote className="italic text-muted-foreground">
                  "{i18n.language === 'he' ? member.quote : member.quoteEn}"
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-muted">
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
                className="p-8 bg-background rounded-2xl text-center animate-fade-up hover:shadow-lg transition-all"
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
