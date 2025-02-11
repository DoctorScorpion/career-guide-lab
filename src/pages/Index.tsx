import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Star, Briefcase, FileText, UserCheck, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Link } from "react-router-dom";
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
  const [isRTL, setIsRTL] = useState(i18n.language === 'he');
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
      title: "אימון קריירה",
      description: "ליווי אישי לפיתוח הקריירה שלך",
      href: "/services#career-coaching"
    },
    {
      icon: FileText,
      title: "כתיבת קורות חיים",
      description: "עיצוב וכתיבת קורות חיים מקצועיים",
      href: "/services#resume-writing"
    },
    {
      icon: UserCheck,
      title: "מיתוג אישי",
      description: "בניית נוכחות דיגיטלית חזקה",
      href: "/services#personal-branding"
    },
    {
      icon: Users,
      title: "גיוס והשמה",
      description: "מציאת המשרה המושלמת עבורך",
      href: "/services#recruitment"
    }
  ];

  const toggleLanguage = () => {
    const newLang = i18n.language === 'he' ? 'en' : 'he';
    i18n.changeLanguage(newLang);
    setIsRTL(newLang === 'he');
    document.documentElement.dir = newLang === 'he' ? 'rtl' : 'ltr';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "ההודעה נשלחה בהצלחה",
          description: "נציג יצור איתך קשר בהקדם",
        });
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast({
        title: "שגיאה בשליחת ההודעה",
        description: "אנא נסה שוב מאוחר יותר",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen bg-background text-foreground ${isRTL ? 'font-heebo' : ''}`}>
      <MainNav />
      
      {/* Hero Section */}
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
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg" className="bg-accent hover:bg-accent/90">
                    השאר פרטים
                    <ArrowRight className={`${isRTL ? 'mr-2' : 'ml-2'} h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>השאר פרטים ונחזור אליך</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">שם מלא</Label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">אימייל</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">טלפון</Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">הודעה</Label>
                      <Textarea
                        id="message"
                        required
                        value={formData.message}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? 'שולח...' : 'שלח'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="lg" asChild>
                <Link to="/about">
                  למד עוד
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Blog Posts */}
      <section className="py-16 bg-accent/5">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl">מאמרים מובילים</h2>
            <p className="text-muted-foreground">
              מדריכים וטיפים שיעזרו לך להתקדם בקריירה
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "איך לכתוב קורות חיים שיבלטו במיוחד ב-2024",
                excerpt: "המדריך המלא לכתיבת קורות חיים שיתפסו את תשומת לבם של מגייסים ומנהלי משאבי אנוש.",
                image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
                slug: "how-to-write-outstanding-cv-2024"
              },
              {
                title: "5 טרנדים בשוק העבודה שכדאי להכיר",
                excerpt: "סקירה מקיפה של המגמות החמות בשוק העבודה והכישורים שיהיו הכי מבוקשים בשנים הקרובות.",
                image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
                slug: "5-job-market-trends-2024"
              }
            ].map((post, i) => (
              <Card key={i} className="group overflow-hidden">
                <Link to={`/blog/${post.slug}`}>
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-6">
                    <CardTitle className="text-xl mb-2 group-hover:text-accent transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription>
                      {post.excerpt}
                    </CardDescription>
                    <div className="mt-4 flex items-center text-accent">
                      <span className="text-sm font-medium">קרא עוד</span>
                      <ArrowRight className="mr-2 h-4 w-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button variant="outline" size="lg" asChild>
              <Link to="/blog">
                לכל המאמרים
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Carousel */}
      <section className="py-16 bg-accent/5">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl">השירותים שלנו</h2>
            <p className="text-muted-foreground">
              מגוון שירותים מקצועיים לפיתוח הקריירה שלך
            </p>
          </div>
          <div className="w-full overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {services.map((service, i) => (
                <div key={i} className="flex-[0_0_300px] min-w-0" style={{ marginInlineEnd: '1.5rem' }}>
                  <Link to={service.href}>
                    <Card className="h-full group hover:shadow-lg transition-all">
                      <CardContent className="pt-6">
                        <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                          <service.icon className="w-6 h-6 text-accent" />
                        </div>
                        <CardTitle className="mb-2">{service.title}</CardTitle>
                        <CardDescription>{service.description}</CardDescription>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              ))}
            </div>
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

      {/* Values Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="font-display text-3xl">הערכים שלנו</h2>
            <p className="text-muted-foreground">
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

      {/* About Section */}
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

      {/* Contact Form */}
      <section className="py-16 bg-accent/5">
        <div className="container">
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="font-display text-3xl mb-4">צור קשר</h2>
              <p className="text-muted-foreground">
                השאירו פרטים ונחזור אליכם בהקדם
              </p>
            </div>
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">שם מלא</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">אימייל</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">טלפון</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">הודעה</Label>
                    <Textarea
                      id="message"
                      required
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'שולח...' : 'שלח'}
                  </Button>
                </form>
              </CardContent>
            </Card>
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
