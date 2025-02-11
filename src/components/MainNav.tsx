import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, Rocket } from "lucide-react";
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
      title: "nav.blog",
      href: "/blog",
      subitems: [
        { title: "nav.mainBlog", href: "/blog" },
        { title: "nav.allPosts", href: "/blog/all" },
        { title: "nav.featuredPosts", href: "/blog/featured" },
        { title: "nav.categories", href: "/blog/categories" }
      ]
    },
    { 
      title: "nav.services",
      href: "/services",
      subitems: [
        { title: "services.items.careerCoaching.title", href: "/services?service=career-coaching" },
        { title: "services.items.resumeWriting.title", href: "/services?service=resume-writing" },
        { title: "services.items.personalBranding.title", href: "/services?service=personal-branding" },
        { title: "services.items.recruitment.title", href: "/services?service=recruitment" }
      ]
    },
    { title: "nav.about", href: "/about" },
    { title: "nav.contact", href: "/contact" },
  ];

  const isJobsPage = location.pathname === '/jobs';

  return (
    <>
      <nav className={`fixed w-full bg-background/95 backdrop-blur-md z-50 border-b transition-transform duration-300 ${
        navVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link 
              to="/" 
              className="font-display text-xl hover:text-accent transition-colors"
            >
              {t("nav.brand")}
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
              className="hidden md:inline-flex items-center gap-2 bg-accent hover:bg-accent/90 shadow-lg hover:shadow-xl transition-all"
              size="sm"
            >
              <Rocket className="w-4 h-4" />
              {t("nav.getStarted")}
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
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
};
