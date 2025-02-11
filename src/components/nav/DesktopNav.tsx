
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Globe, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { NavItem } from "./types";
import { ResumeAnalyzerButton } from "../ResumeAnalyzerButton";

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
            <CollapsibleTrigger className="flex items-center gap-1 text-sm font-medium hover:text-accent transition-colors">
              {item.title}
              <ChevronDown className="w-4 h-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="absolute mt-2 bg-background border rounded-lg py-2 shadow-lg min-w-[200px] z-50">
              {item.subitems.map((subitem) => (
                <Link
                  key={subitem.href}
                  to={subitem.href}
                  className="block px-4 py-2.5 text-sm hover:bg-accent/10 transition-colors"
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
            className="text-sm font-medium hover:text-accent transition-colors"
          >
            {item.title}
          </Link>
        )
      ))}
      <div className="flex items-center gap-4">
        <ResumeAnalyzerButton 
          onClick={handleResumeAnalyzerClick}
          text={t("resume.analyzer.title")}
        />

        <button
          className="p-2 rounded-full hover:bg-accent/10 transition-colors"
          aria-label={t("nav.toggleLanguage")}
          onClick={toggleLanguage}
        >
          <Globe className="w-5 h-5" />
          <span className="ml-2 text-sm">{isRTL ? 'EN' : 'עב'}</span>
        </button>
        
        <Button asChild className="bg-accent hover:bg-accent/90">
          <Link to="/contact">
            {t("nav.getStarted")}
          </Link>
        </Button>
      </div>
    </div>
  );
};
