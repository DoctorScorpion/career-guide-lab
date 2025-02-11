
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Globe, Menu, X } from "lucide-react";
import { useState } from "react";

interface NavItem {
  title: string;
  href: string;
}

const navItems: NavItem[] = [
  { title: "בלוג", href: "/blog" },
  { title: "שירותים", href: "/services" },
  { title: "אודות", href: "/about" },
  { title: "צור קשר", href: "/contact" },
];

export function MainNav() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <nav className="fixed w-full bg-background/80 backdrop-blur-md z-50 border-b">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="font-display text-xl">
          Amit Bakshi
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <button
            className="p-2 rounded-full hover:bg-accent/10 transition-colors"
            aria-label="Toggle language"
          >
            <Globe className="w-5 h-5" />
          </button>
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="text-sm hover:text-accent transition-colors"
            >
              {item.title}
            </Link>
          ))}
          <Button asChild>
            <Link to="/contact" className="bg-accent hover:bg-accent/90">
              בואו נתחיל
            </Link>
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">פתח תפריט</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 mt-6">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="text-lg font-medium hover:text-accent transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.title}
                  </Link>
                ))}
                <Button asChild className="mt-4">
                  <Link 
                    to="/contact" 
                    className="bg-accent hover:bg-accent/90 w-full"
                    onClick={() => setIsOpen(false)}
                  >
                    בואו נתחיל
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
