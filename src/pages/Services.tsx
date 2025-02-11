
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, FileText, UserCheck, Users, ArrowRight, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const Services = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'he';
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedService = searchParams.get('service');

  const services = [
    { key: 'careerCoaching', icon: Briefcase, id: 'career-coaching' },
    { key: 'resumeWriting', icon: FileText, id: 'resume-writing' },
    { key: 'personalBranding', icon: UserCheck, id: 'personal-branding' },
    { key: 'recruitment', icon: Users, id: 'recruitment' },
  ];

  useEffect(() => {
    if (selectedService) {
      const element = document.getElementById(selectedService);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        const dialogTrigger = element.querySelector('button');
        if (dialogTrigger) {
          setTimeout(() => {
            dialogTrigger.click();
          }, 500);
        }
      }
    }
  }, [selectedService]);

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'font-heebo' : ''}`}>
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

      <section className="py-16">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Dialog key={service.key}>
                <DialogTrigger asChild>
                  <Card
                    id={service.id}
                    className="group hover:shadow-lg transition-all animate-fade-up cursor-pointer"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardHeader className="space-y-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                        <service.icon className="w-6 h-6 text-accent" />
                      </div>
                      <CardTitle className="text-2xl font-display">
                        {t(`services.items.${service.key}.title`)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        {t(`services.items.${service.key}.description`)}
                      </p>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent dir={isRTL ? 'rtl' : 'ltr'} className="sm:max-w-[700px] p-0 overflow-hidden">
                  <div className="relative h-40 bg-gradient-to-br from-accent/20 to-accent/5">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <service.icon className="w-16 h-16 text-accent/40" />
                    </div>
                  </div>
                  <div className="p-8">
                    <DialogHeader>
                      <DialogTitle className={`text-3xl font-display mb-4 font-medium w-full ${isRTL ? 'text-right' : 'text-left'}`}>
                        {t(`services.items.${service.key}.title`)}
                      </DialogTitle>
                      <p className={`text-lg text-muted-foreground leading-relaxed w-full ${isRTL ? 'text-right' : 'text-left'}`}>
                        {t(`services.items.${service.key}.description`)}
                      </p>
                    </DialogHeader>
                    <Separator className="my-8" />
                    <div className="space-y-8">
                      <div className="prose prose-blue max-w-none">
                        <div 
                          className={`
                            whitespace-pre-line text-muted-foreground leading-relaxed
                            [&>*:first-child]:text-foreground [&>*:first-child]:font-medium
                            [&_•]:text-accent [&_•]:font-medium
                            [&_•]:inline-block [&_•]:${isRTL ? 'ml-2' : 'mr-2'}
                          `}
                        >
                          {t(`services.items.${service.key}.fullDescription`)}
                        </div>
                      </div>
                      <div className="pt-4">
                        <Button 
                          className="w-full shadow-lg hover:shadow-xl transition-all" 
                          size="lg"
                        >
                          {t('contact.getStarted')}
                          <ArrowRight className={`${isRTL ? 'mr-2 rotate-180' : 'ml-2'} w-4 h-4`} />
                        </Button>
                      </div>
                    </div>
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
