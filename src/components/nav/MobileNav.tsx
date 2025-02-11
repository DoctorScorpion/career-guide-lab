
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { FileSearch, Globe } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { NavItem } from "./types";

interface MobileNavProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  navItems: NavItem[];
  openCollapsible: string | null;
  setOpenCollapsible: (value: string | null) => void;
  handleNavItemClick: (href: string) => void;
  handleResumeAnalyzerClick: (e: React.MouseEvent) => void;
  toggleLanguage: () => void;
  isRTL: boolean;
  t: (key: string) => string;
}

export const MobileNav = ({
  isOpen,
  setIsOpen,
  navItems,
  openCollapsible,
  setOpenCollapsible,
  handleNavItemClick,
  handleResumeAnalyzerClick,
  toggleLanguage,
  isRTL,
  t
}: MobileNavProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side={isRTL ? "right" : "left"} className="w-[300px] sm:w-[400px]">
        <div className="flex flex-col gap-6 mt-6">
          <Button 
            variant="ghost" 
            className="flex items-center gap-2 justify-start"
            onClick={handleResumeAnalyzerClick}
          >
            <FileSearch className="w-5 h-5" />
            <span>{t("resume.analyzer.title")}</span>
          </Button>

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
  );
};
