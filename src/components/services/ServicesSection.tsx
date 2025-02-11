
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import useEmblaCarousel from 'embla-carousel-react';
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Briefcase, FileText, UserCheck, Users } from "lucide-react";

export const ServicesSection = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'he';
  const navigate = useNavigate();
  const [emblaRef] = useEmblaCarousel({ 
    direction: isRTL ? 'rtl' : 'ltr',
    align: 'start',
    containScroll: 'trimSnaps'
  });

  const services = [
    {
      icon: Briefcase,
      title: t("services.items.careerCoaching.title"),
      description: t("services.items.careerCoaching.description"),
      href: "/services#career-coaching"
    },
    {
      icon: FileText,
      title: t("services.items.resumeWriting.title"),
      description: t("services.items.resumeWriting.description"),
      href: "/services#resume-writing"
    },
    {
      icon: UserCheck,
      title: t("services.items.personalBranding.title"),
      description: t("services.items.personalBranding.description"),
      href: "/services#personal-branding"
    },
    {
      icon: Users,
      title: t("services.items.recruitment.title"),
      description: t("services.items.recruitment.description"),
      href: "/services#recruitment"
    }
  ];

  const handleServiceClick = (serviceId: string) => {
    navigate(`/services?service=${serviceId}`);
  };

  return (
    <section className="py-16 bg-accent/5">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl">{t("services.title")}</h2>
          <p className="text-muted-foreground">
            {t("services.description")}
          </p>
        </div>
        <div className="w-full overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6">
            {services.map((service, i) => (
              <div key={i} className="flex-[0_0_300px] min-w-0" style={{ marginInlineEnd: '1.5rem' }}>
                <Card 
                  className="h-full group hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => handleServiceClick(service.href.split('#')[1])}
                >
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                      <service.icon className="w-6 h-6 text-accent" />
                    </div>
                    <CardTitle className="mb-2">{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
