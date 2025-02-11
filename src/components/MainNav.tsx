
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Globe, Menu, X, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface NavItem {
  title: string;
  href: string;
  subitems?: NavItem[];
}

export function MainNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [openCollapsible, setOpenCollapsible] = useState<string | null>(null);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'he';

  const toggleLanguage = () => {
    const newLang = i18n.language === 'he' ? 'en' : 'he';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  // Auto-hide navbar on scroll down
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

  const navItems: NavItem[] = [
    { 
      title: t("nav.blog"),
      href: "/blog",
      subitems: [
        { title: t("nav.latestPosts"), href: "/blog/latest" },
        { title: t("nav.categories"), href: "/blog/categories" }
      ]
    },
    { 
      title: t("nav.services"),
      href: "/services",
      subitems: [
        { title: t("services.careerCoaching.title"), href: "/services#career-coaching" },
        { title: t("services.resumeWriting.title"), href: "/services#resume-writing" },
        { title: t("services.personalBranding.title"), href: "/services#personal-branding" },
        { title: t("services.recruitment.title"), href: "/services#recruitment" },
        { title: t("resume.analyzer.title"), href: "/#resume-analyzer" }
      ]
    },
    { title: t("nav.about"), href: "/about" },
    { title: t("nav.contact"), href: "/contact" },
  ];

  return (
    <nav className={`fixed w-full bg-background/80 backdrop-blur-md z-50 border-b transition-transform duration-300 ${
      navVisible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="font-display text-xl">
          {t("nav.brand")}
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <button
            className="p-2 rounded-full hover:bg-accent/10 transition-colors"
            aria-label={t("nav.toggleLanguage")}
            onClick={toggleLanguage}
          >
            <Globe className="w-5 h-5" />
            <span className="ml-2 text-sm">{isRTL ? 'EN' : 'עב'}</span>
          </button>
          {navItems.map((item) => (
            item.subitems ? (
              <Collapsible
                key={item.href}
                open={openCollapsible === item.href}
                onOpenChange={() => setOpenCollapsible(openCollapsible === item.href ? null : item.href)}
              >
                <CollapsibleTrigger className="flex items-center gap-1 text-sm hover:text-accent transition-colors">
                  {item.title}
                  <ChevronDown className="w-4 h-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="absolute mt-2 bg-background border rounded-md py-2 shadow-lg">
                  {item.subitems.map((subitem) => (
                    <Link
                      key={subitem.href}
                      to={subitem.href}
                      className="block px-4 py-2 text-sm hover:bg-accent/10 transition-colors"
                      onClick={() => setOpenCollapsible(null)}
                    >
                      {subitem.title}
                    </Link>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <Link
                key={item.href}
                to={item.href}
                className="text-sm hover:text-accent transition-colors"
              >
                {item.title}
              </Link>
            )
          ))}
          <Button asChild>
            <Link to="/contact" className="bg-accent hover:bg-accent/90">
              {t("nav.getStarted")}
            </Link>
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                <span className="sr-only">{t("nav.toggleMenu")}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side={isRTL ? "right" : "left"} className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 mt-6">
                <button
                  className="flex items-center gap-2 text-sm hover:text-accent transition-colors"
                  onClick={toggleLanguage}
                >
                  <Globe className="w-5 h-5" />
                  <span>{isRTL ? 'English' : 'עברית'}</span>
                </button>
                {navItems.map((item) => (
                  item.subitems ? (
                    <Collapsible
                      key={item.href}
                      open={openCollapsible === item.href}
                      onOpenChange={() => setOpenCollapsible(openCollapsible === item.href ? null : item.href)}
                    >
                      <CollapsibleTrigger className="flex items-center justify-between w-full text-lg font-medium hover:text-accent transition-colors">
                        {item.title}
                        <ChevronDown className="w-4 h-4" />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pr-4 mt-2">
                        {item.subitems.map((subitem) => (
                          <Link
                            key={subitem.href}
                            to={subitem.href}
                            className="block py-2 text-base hover:text-accent transition-colors"
                            onClick={() => handleNavItemClick(subitem.href)}
                          >
                            {subitem.title}
                          </Link>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="text-lg font-medium hover:text-accent transition-colors"
                      onClick={() => handleNavItemClick(item.href)}
                    >
                      {item.title}
                    </Link>
                  )
                ))}
                <Button asChild className="mt-4">
                  <Link 
                    to="/contact" 
                    className="bg-accent hover:bg-accent/90 w-full"
                    onClick={() => handleNavItemClick('/contact')}
                  >
                    {t("nav.getStarted")}
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
