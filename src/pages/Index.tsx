import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ItineraryGenerator from "@/components/ItineraryGenerator";
import RecommendedDestinations from "@/components/RecommendedDestinations";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <ItineraryGenerator />
          <RecommendedDestinations />
        </div>
      </div>
    </div>
  );
};

export default Index;
