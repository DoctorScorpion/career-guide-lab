
import { Button } from "@/components/ui/button";
import { ArrowRight, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const Index = () => {
  const { t, i18n } = useTranslation();
  const [isRTL, setIsRTL] = useState(i18n.language === 'he');

  const toggleLanguage = () => {
    const newLang = i18n.language === 'he' ? 'en' : 'he';
    i18n.changeLanguage(newLang);
    setIsRTL(newLang === 'he');
    document.documentElement.dir = newLang === 'he' ? 'rtl' : 'ltr';
  };

  return (
    <div className={`min-h-screen bg-background text-foreground ${isRTL ? 'font-heebo' : ''}`}>
      {/* Nav */}
      <nav className="fixed w-full bg-background/80 backdrop-blur-md z-50 border-b">
        <div className="container flex items-center justify-between h-16">
          <a href="/" className="font-display text-xl">
            Amit Bakshi
          </a>
          <div className="flex items-center gap-6">
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-full hover:bg-accent/10 transition-colors"
              aria-label="Toggle language"
            >
              <Globe className="w-5 h-5" />
            </button>
            <a href="#services" className="text-sm hover:text-accent transition-colors">
              {t('nav.services')}
            </a>
            <a href="#about" className="text-sm hover:text-accent transition-colors">
              {t('nav.about')}
            </a>
            <Button className="bg-accent hover:bg-accent/90">
              {t('nav.getStarted')}
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-up">
            <div className="inline-flex items-center rounded-full px-4 py-1 text-sm bg-accent/10 text-accent">
              {t('hero.badge')}
            </div>
            <h1 className="font-display text-5xl sm:text-6xl font-medium leading-tight">
              {t('hero.title')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="bg-accent hover:bg-accent/90">
                {t('hero.cta.schedule')}
                <ArrowRight className={`${isRTL ? 'mr-2' : 'ml-2'} h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
              </Button>
              <Button variant="outline" size="lg">
                {t('hero.cta.learnMore')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-16 bg-secondary">
        <div className="container">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="font-display text-3xl">{t('services.title')}</h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              {t('services.subtitle')}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                key: 'coaching',
                icon: ArrowRight,
              },
              {
                key: 'resume',
                icon: ArrowRight,
              },
              {
                key: 'consulting',
                icon: ArrowRight,
              },
            ].map((service, i) => (
              <div
                key={service.key}
                className="group p-6 bg-background rounded-lg border transition-all hover:shadow-lg animate-fade-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <service.icon className={`w-6 h-6 text-accent ${isRTL ? 'rotate-180' : ''}`} />
                </div>
                <h3 className="font-display text-xl mb-2">
                  {t(`services.items.${service.key}.title`)}
                </h3>
                <p className="text-muted-foreground">
                  {t(`services.items.${service.key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-up">
            <h2 className="font-display text-3xl">{t('about.title')}</h2>
            <p className="text-muted-foreground">
              {t('about.content')}
            </p>
            <Button variant="outline" size="lg">
              {t('about.cta')}
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              {t('footer.rights')}
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                {t('footer.privacy')}
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                {t('footer.terms')}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
