
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/MainNav";
import { ResumeAnalyzer } from "@/components/ResumeAnalyzer";
import { ContactForm } from "@/components/contact/ContactForm";
import { ServicesSection } from "@/components/services/ServicesSection";
import { ValuesSection } from "@/components/values/ValuesSection";

const Index = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'he';

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
              <ContactForm />
              <Button variant="outline" size="lg" asChild>
                <Link to="/about">
                  {t("hero.cta.learnMore")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <ServicesSection />
      <ValuesSection />

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
