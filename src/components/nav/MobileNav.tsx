
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Globe, ChevronDown, Rocket } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { NavItem } from "./types";
import { useState } from "react";
import { UserTypeDialog } from "./UserTypeDialog";

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleStartClick = () => {
    setIsOpen(false);
    setIsDialogOpen(true);
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
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
                    {t(item.title)}
                    <ChevronDown className="w-4 h-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pr-4 mt-2">
                    {item.subitems.map((subitem) => (
                      <Link
                        key={subitem.href}
                        to={subitem.href}
                        className="block py-3 text-base hover:text-accent transition-colors"
                        onClick={() => {
                          handleNavItemClick(subitem.href);
                          if (subitem.title === "nav.resumeAnalyzer") {
                            handleResumeAnalyzerClick(new MouseEvent('click') as any);
                          }
                        }}
                      >
                        {t(subitem.title)}
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
                  {t(item.title)}
                </Link>
              )
            ))}
            
            <Button 
              onClick={handleStartClick}
              className="mt-4 bg-accent hover:bg-accent/90 w-full"
            >
              <Rocket className="w-4 h-4 mr-2" />
              {t("nav.getStarted")}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <UserTypeDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
};
