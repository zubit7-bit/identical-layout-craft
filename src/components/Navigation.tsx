import { Button } from "@/components/ui/button";

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">TRAVELARA</h1>
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm font-medium text-foreground hover:text-accent transition-colors">
              Home
            </a>
            <a href="#" className="text-sm font-medium text-foreground hover:text-accent transition-colors">
              Itinerary
            </a>
            <a href="#" className="text-sm font-medium text-foreground hover:text-accent transition-colors">
              Explore
            </a>
            <a href="#" className="text-sm font-medium text-foreground hover:text-accent transition-colors">
              Social
            </a>
            <a href="#" className="text-sm font-medium text-foreground hover:text-accent transition-colors">
              Profile
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
