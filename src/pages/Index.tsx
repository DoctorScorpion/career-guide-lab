
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Star, Briefcase, FileText, UserCheck, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useEmblaCarousel from 'embla-carousel-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { MainNav } from "@/components/MainNav";
import { ResumeAnalyzer } from "@/components/ResumeAnalyzer";

const Index = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'he';
  const navigate = useNavigate();
  const [emblaRef] = useEmblaCarousel({ 
    direction: isRTL ? 'rtl' : 'ltr',
    align: 'start',
    containScroll: 'trimSnaps'
  });
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      toast({
        title: t("contact.form.success"),
        description: t("contact.form.successDetail"),
      });
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      toast({
        title: t("contact.form.error"),
        description: t("contact.form.errorDetail"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleServiceClick = (serviceId: string) => {
    navigate(`/services?service=${serviceId}`);
  };

  return (
    <div className={`min-h-screen bg-background text-foreground ${isRTL ? 'font-heebo' : ''}`}>
      <MainNav />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-accent/5 to-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-up">
            <div className="inline-flex items-center rounded-full px-4 py-1 text-sm bg-accent/10 text-accent">
              {t("hero.tag")}
            </div>
            <h1 className="font-display text-5xl sm:text-6xl font-medium leading-tight">
              {t("hero.title")}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("hero.description")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg" className="bg-accent hover:bg-accent/90">
                    {t("hero.cta.contact")}
                    <ArrowRight className={`${isRTL ? 'mr-2' : 'ml-2'} h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{t("hero.form.title")}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t("hero.form.name")}</Label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t("hero.form.email")}</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t("hero.form.phone")}</Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">{t("hero.form.message")}</Label>
                      <Textarea
                        id="message"
                        required
                        value={formData.message}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? t("hero.form.sending") : t("hero.form.submit")}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="lg" asChild>
                <Link to="/about">
                  {t("hero.cta.learnMore")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Carousel */}
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

      {/* Values Section */}
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

      {/* Resume Analyzer Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl">
              {t("resume.analyzer.title")}
            </h2>
            <p className="text-muted-foreground mt-4">
              {t("resume.analyzer.description")}
            </p>
          </div>
          <ResumeAnalyzer />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {t("footer.copyright")} 2024
            </p>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                {t("footer.privacy")}
              </Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                {t("footer.terms")}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
