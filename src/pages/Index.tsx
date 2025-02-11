
import { Button } from "@/components/ui/button";
import { ArrowRight, Globe, Heart, Star, Briefcase } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Link } from "react-router-dom";
import useEmblaCarousel from 'embla-carousel-react';

const Index = () => {
  const { t, i18n } = useTranslation();
  const [isRTL, setIsRTL] = useState(i18n.language === 'he');
  const [emblaRef] = useEmblaCarousel({ direction: isRTL ? 'rtl' : 'ltr' });

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
          <Link to="/" className="font-display text-xl">
            Amit Bakshi
          </Link>
          <div className="flex items-center gap-6">
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-full hover:bg-accent/10 transition-colors"
              aria-label="Toggle language"
            >
              <Globe className="w-5 h-5" />
            </button>
            <Link to="/services" className="text-sm hover:text-accent transition-colors">
              שירותים
            </Link>
            <Link to="/about" className="text-sm hover:text-accent transition-colors">
              אודות
            </Link>
            <Link to="/contact" className="text-sm hover:text-accent transition-colors">
              צור קשר
            </Link>
            <Button asChild>
              <Link to="/contact" className="bg-accent hover:bg-accent/90">
                בואו נתחיל
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero with Carousel */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-accent/5 to-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-up">
            <div className="inline-flex items-center rounded-full px-4 py-1 text-sm bg-accent/10 text-accent">
              ייעוץ קריירה מקצועי
            </div>
            <h1 className="font-display text-5xl sm:text-6xl font-medium leading-tight">
              נעזור לך למצוא את הקריירה המושלמת
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              אנחנו כאן כדי לעזור לך למצוא את הדרך המקצועית הנכונה עבורך. הצוות המקצועי שלנו יסייע לך בכל שלב בדרך.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="bg-accent hover:bg-accent/90">
                קבע פגישת ייעוץ
                <ArrowRight className={`${isRTL ? 'mr-2' : 'ml-2'} h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
              </Button>
              <Button variant="outline" size="lg">
                למד עוד
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="font-display text-3xl">הערכים שלנו</h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              אנחנו מאמינים בליווי אישי, מקצועי וחדשני בתהליך פיתוח הקריירה
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                key: 'personal',
                icon: Heart,
                title: "ליווי אישי",
                description: "אנחנו מאמינים בהתאמה אישית לכל מועמד"
              },
              {
                key: 'professional',
                icon: Star,
                title: "מקצועיות",
                description: "צוות המומחים שלנו עם ניסיון רב בתחום"
              },
              {
                key: 'innovation',
                icon: Briefcase,
                title: "חדשנות",
                description: "שימוש בכלים מתקדמים לפיתוח קריירה"
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

      {/* About */}
      <section id="about" className="py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-up">
            <h2 className="font-display text-3xl">אודותינו</h2>
            <p className="text-muted-foreground">
              עם ניסיון של שנים בתחום ייעוץ הקריירה, אנחנו מסייעים לאלפי אנשים למצוא את דרכם המקצועית. הצוות המקצועי שלנו כולל יועצי קריירה מנוסים, מומחי גיוס ופסיכולוגים תעסוקתיים.
            </p>
            <Button variant="outline" size="lg" asChild>
              <Link to="/about">
                קרא עוד עלינו
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © כל הזכויות שמורות 2024
            </p>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                מדיניות פרטיות
              </Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                תנאי שימוש
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
