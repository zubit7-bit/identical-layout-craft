import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Waves, Ship, Mountain, ShoppingBag, Sun, Fish, Plane } from "lucide-react";
import Navigation from "@/components/Navigation";

interface Day {
  day: number;
  title: string;
  activities: string[];
}

interface ItineraryResult {
  destination: string;
  duration: number;
  budget?: number;
  interests?: string[];
  days: Day[];
}

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const itinerary = location.state?.itinerary as ItineraryResult;

  if (!itinerary) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-foreground">No itinerary found</h2>
          <Button onClick={() => navigate("/")} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const getDayIcon = (day: number) => {
    const icons = [Leaf, Waves, Ship, Mountain, ShoppingBag];
    const Icon = icons[(day - 1) % icons.length];
    return <Icon className="h-8 w-8 text-muted-foreground" />;
  };

  const getActivityIcon = (day: number) => {
    const icons = [Sun, Fish, Fish, Fish, Plane];
    const Icon = icons[(day - 1) % icons.length];
    return <Icon className="h-8 w-8 text-muted-foreground" />;
  };

  const calculateTotalBudget = () => {
    let total = 0;
    itinerary.days.forEach(day => {
      day.activities.forEach(activity => {
        const matches = activity.match(/₹[\d,]+/g);
        if (matches) {
          matches.forEach(match => {
            const amount = parseInt(match.replace(/[₹,]/g, ''));
            if (!isNaN(amount)) total += amount;
          });
        }
      });
    });
    return total;
  };

  const totalBudget = calculateTotalBudget();
  const userQuery = `Plan a ${itinerary.duration}-day budget trip to ${itinerary.destination}${itinerary.budget ? ` under ₹${itinerary.budget.toLocaleString()}` : ''}`;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section with Background */}
      <div 
        className="relative pt-24 pb-12 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('/src/assets/hero-bg.jpg')`
        }}
      >
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-white mb-8">
            Your Personalized Travel Itinerary
          </h1>
          
          <div className="flex justify-center items-center gap-4 flex-wrap">
            <div className="bg-white px-6 py-3 rounded-lg shadow-md">
              <p className="text-foreground text-sm md:text-base">{userQuery}</p>
            </div>
            <Button 
              onClick={() => navigate("/")}
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-6 h-11"
            >
              Plan Another Trip
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            Your {itinerary.duration}-Day {itinerary.destination} Adventure
          </h2>

          <div className="space-y-6">
            {itinerary.days.map((day) => (
              <Card key={day.day} className="border-border bg-card overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Left Icon */}
                    <div className="flex-shrink-0 mt-2">
                      {getDayIcon(day.day)}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-foreground mb-3">
                        Day {day.day}: {day.title.replace(/^Day \d+:\s*/, '')}
                      </h3>
                      <ul className="space-y-2">
                        {day.activities.map((activity, idx) => (
                          <li key={idx} className="text-foreground/90 text-sm md:text-base">
                            {activity}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Right Icon */}
                    <div className="flex-shrink-0 mt-2">
                      {getActivityIcon(day.day)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Budget Summary */}
          <div className="mt-12 text-center">
            <p className="text-xl font-semibold text-foreground mb-8">
              Total Estimated Budget: ₹{totalBudget.toLocaleString()} 
              {itinerary.budget && (
                <span className="text-muted-foreground"> (Under ₹{itinerary.budget.toLocaleString()})</span>
              )}
            </p>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 flex-wrap">
              <Button 
                variant="outline"
                className="px-8"
              >
                Share Itinerary
              </Button>
              <Button 
                className="bg-accent hover:bg-accent/90 text-accent-foreground px-8"
              >
                Download PDF
              </Button>
              <Button 
                className="bg-accent hover:bg-accent/90 text-accent-foreground px-8"
              >
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
