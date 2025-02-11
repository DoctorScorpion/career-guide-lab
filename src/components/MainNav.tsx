import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, Rocket, Briefcase, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { MobileNav } from "./nav/MobileNav";
import { DesktopNav } from "./nav/DesktopNav";
import { UserTypeDialog } from "./nav/UserTypeDialog";
import { NavItem } from "./nav/types";

export function MainNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [openCollapsible, setOpenCollapsible] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'he';
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [isRTL, i18n.language]);

  const handleResumeAnalyzerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollToAnalyzer: true } });
    } else {
      const element = document.getElementById('resume-analyzer');
      if (element) {
        setIsOpen(false);
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  useEffect(() => {
    const state = location.state as { scrollToAnalyzer?: boolean } | null;
    if (state?.scrollToAnalyzer) {
      const element = document.getElementById('resume-analyzer');
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          navigate(location.pathname, { replace: true, state: {} });
        }, 100);
      }
    }
  }, [location.state, navigate, location.pathname]);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'he' ? 'en' : 'he';
    i18n.changeLanguage(newLang).then(() => {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 100);
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setNavVisible(false);
      } else {
        setNavVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleNavItemClick = (href: string) => {
    setIsOpen(false);
    setOpenCollapsible(null);
  };

  const handleStartClick = () => {
    setIsDialogOpen(true);
  };

  const navItems: NavItem[] = [
    { 
      title: "nav.tools",
      href: "/tools",
      subitems: [
        { title: "nav.jobMatcher", href: "/jobs" },
        { title: "nav.resumeAnalyzer", href: "/" }
      ]
    },
    { 
      title: "nav.services",
      href: "/services",
      subitems: [
        { title: "services.items.careerCoaching.title", href: "/services?service=career-coaching" },
        { title: "services.items.resumeWriting.title", href: "/services?service=resume-writing" },
        { title: "services.items.personalBranding.title", href: "/services?service=personal-branding" },
        { title: "services.items.careerTransition.title", href: "/services?service=career-transition" },
        { title: "services.items.recruitment.title", href: "/services?service=recruitment" },
        { title: "services.items.hrConsulting.title", href: "/services?service=hr-consulting" },
        { title: "services.items.talentManagement.title", href: "/services?service=talent-management" },
        { title: "services.items.orgDevelopment.title", href: "/services?service=org-development" }
      ]
    },
    { title: "nav.about", href: "/about" },
    { title: "nav.contact", href: "/contact" }
  ];

  return (
    <>
      <nav className="fixed w-full z-50 navbar-glass transition-all duration-300">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link 
              to="/" 
              className="flex items-center gap-2 group"
              aria-label="Amit Bakshi HR & Career Solutions"
            >
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 bg-primary/10 rounded-lg transform rotate-3 transition-transform group-hover:rotate-6" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Star className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="logo-text">Amit Bakshi</span>
                <span className="text-xs text-muted-foreground">HR & Career Solutions</span>
              </div>
            </Link>

            <DesktopNav
              navItems={navItems}
              openCollapsible={openCollapsible}
              setOpenCollapsible={setOpenCollapsible}
              handleResumeAnalyzerClick={handleResumeAnalyzerClick}
              toggleLanguage={toggleLanguage}
              isRTL={isRTL}
              t={t}
            />
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={handleStartClick}
              className="hidden md:inline-flex items-center gap-2 gradient-button"
              size="lg"
            >
              <Rocket className="w-5 h-5" />
              {t("nav.getStarted")}
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden hover:bg-secondary/80"
                >
                  {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  <span className="sr-only">{t("nav.toggleMenu")}</span>
                </Button>
              </SheetTrigger>
              <MobileNav
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                navItems={navItems}
                openCollapsible={openCollapsible}
                setOpenCollapsible={setOpenCollapsible}
                handleNavItemClick={handleNavItemClick}
                handleResumeAnalyzerClick={handleResumeAnalyzerClick}
                toggleLanguage={toggleLanguage}
                isRTL={isRTL}
                t={t}
              />
            </Sheet>
          </div>
        </div>
      </nav>

      <UserTypeDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
}
