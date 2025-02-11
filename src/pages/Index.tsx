
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="fixed w-full bg-background/80 backdrop-blur-md z-50 border-b">
        <div className="container flex items-center justify-between h-16">
          <a href="/" className="font-display text-xl">
            Amit Bakshi
          </a>
          <div className="flex items-center gap-6">
            <a href="#services" className="text-sm hover:text-accent transition-colors">
              Services
            </a>
            <a href="#about" className="text-sm hover:text-accent transition-colors">
              About
            </a>
            <Button className="bg-accent hover:bg-accent/90">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-up">
            <div className="inline-flex items-center rounded-full px-4 py-1 text-sm bg-accent/10 text-accent">
              Transforming Careers
            </div>
            <h1 className="font-display text-5xl sm:text-6xl font-medium leading-tight">
              Expert Career Guidance & HR Solutions
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Unlock your professional potential with personalized career guidance and comprehensive HR solutions tailored to your needs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="bg-accent hover:bg-accent/90">
                Schedule Consultation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-16 bg-secondary">
        <div className="container">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="font-display text-3xl">Our Services</h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Comprehensive career development and HR solutions designed to help you succeed
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <div
                key={service.title}
                className="group p-6 bg-background rounded-lg border transition-all hover:shadow-lg animate-fade-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <service.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-display text-xl mb-2">{service.title}</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-up">
            <h2 className="font-display text-3xl">About Amit Bakshi</h2>
            <p className="text-muted-foreground">
              With over a decade of experience in HR and career development, Amit Bakshi helps professionals navigate their career paths and organizations build stronger teams.
            </p>
            <Button variant="outline" size="lg">
              Learn More About Us
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 Amit Bakshi HR & Career Solutions. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const services = [
  {
    title: "Career Coaching",
    description: "Personalized guidance to help you navigate your career path and achieve your professional goals.",
    icon: ArrowRight,
  },
  {
    title: "Resume Building",
    description: "Expert resume crafting services to highlight your skills and experience effectively.",
    icon: ArrowRight,
  },
  {
    title: "HR Consulting",
    description: "Comprehensive HR solutions for organizations looking to optimize their workforce.",
    icon: ArrowRight,
  },
];

export default Index;
