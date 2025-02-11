
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, FileText, UserCheck, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Services = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'he';

  const services = [
    { key: 'careerCoaching', icon: Briefcase },
    { key: 'resumeWriting', icon: FileText },
    { key: 'personalBranding', icon: UserCheck },
    { key: 'recruitment', icon: Users },
  ];

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'font-heebo' : ''}`}>
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-accent/5 to-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-up">
            <h1 className="font-display text-4xl font-medium">
              {t('services.title')}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t('services.intro')}
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Dialog key={service.key}>
                <DialogTrigger asChild>
                  <Card
                    id={service.key.toLowerCase().replace('c', '-')}
                    className="group hover:shadow-lg transition-all animate-fade-up cursor-pointer"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardHeader className="space-y-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                        <service.icon className="w-6 h-6 text-accent" />
                      </div>
                      <CardTitle className="text-2xl font-display">
                        {t(`services.${service.key}.title`)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        {t(`services.${service.key}.description`)}
                      </p>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-display">
                      {t(`services.${service.key}.title`)}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="mt-4 whitespace-pre-line">
                    {t(`services.${service.key}.fullDescription`)}
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
