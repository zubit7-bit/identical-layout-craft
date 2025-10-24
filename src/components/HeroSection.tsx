import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <div 
      className="relative min-h-[500px] flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background/90" />
      <div className="relative z-10 container mx-auto px-6 py-32 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-foreground">
          Plan Your Perfect Trip<br />with Travelara
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8">
          Your Personalized Travel Itinerary Assistant
        </p>
        <div className="max-w-2xl mx-auto flex gap-3 bg-card p-3 rounded-full shadow-lg">
          <Input
            type="text"
            placeholder="Where do you want to go?"
            className="border-0 bg-transparent text-base focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Button variant="default" size="lg" className="rounded-full bg-accent hover:bg-accent/90 text-accent-foreground px-8">
            Search Trips
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
