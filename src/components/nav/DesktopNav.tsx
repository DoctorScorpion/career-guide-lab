
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileSearch, Globe, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { NavItem } from "./types";

interface DesktopNavProps {
  navItems: NavItem[];
  openCollapsible: string | null;
  setOpenCollapsible: (value: string | null) => void;
  handleResumeAnalyzerClick: (e: React.MouseEvent) => void;
  toggleLanguage: () => void;
  isRTL: boolean;
  t: (key: string) => string;
}

export const DesktopNav = ({
  navItems,
  openCollapsible,
  setOpenCollapsible,
  handleResumeAnalyzerClick,
  toggleLanguage,
  isRTL,
  t
}: DesktopNavProps) => {
  return (
    <div className="hidden md:flex items-center gap-6">
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
      <div className="flex items-center gap-4">
        <Button 
          variant="outline"
          size="sm"
          onClick={handleResumeAnalyzerClick}
          className="relative group overflow-hidden hover:border-accent/50 transition-all duration-300"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-accent/10 to-accent/5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
          <div className="relative flex items-center gap-2">
            <FileSearch className="w-4 h-4 text-accent animate-pulse" />
            <span className="font-medium">{t("resume.analyzer.title")}</span>
          </div>
        </Button>

        <button
          className="p-2 rounded-full hover:bg-accent/10 transition-colors"
          aria-label={t("nav.toggleLanguage")}
          onClick={toggleLanguage}
        >
          <Globe className="w-5 h-5" />
          <span className="ml-2 text-sm">{isRTL ? 'EN' : 'עב'}</span>
        </button>
        
        <Button asChild>
          <Link to="/contact" className="bg-accent hover:bg-accent/90">
            {t("nav.getStarted")}
          </Link>
        </Button>
      </div>
    </div>
  );
};
