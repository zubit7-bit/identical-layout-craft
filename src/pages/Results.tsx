import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MapPin, Calendar, DollarSign } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 text-foreground">
              Your {itinerary.destination} Adventure
            </h1>
            <div className="flex flex-wrap gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>{itinerary.destination}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>{itinerary.duration} Days</span>
              </div>
              {itinerary.budget && (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  <span>₹{itinerary.budget.toLocaleString()}</span>
                </div>
              )}
            </div>
            {itinerary.interests && itinerary.interests.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {itinerary.interests.map((interest, idx) => (
                  <span 
                    key={idx}
                    className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            {itinerary.days.map((day) => (
              <Card key={day.day} className="border-border">
                <CardHeader className="bg-accent/10">
                  <CardTitle className="text-2xl text-foreground">
                    {day.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    {day.activities.map((activity, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-medium">
                          {idx + 1}
                        </span>
                        <span className="text-foreground pt-0.5">{activity}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button 
              onClick={() => navigate("/")}
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 h-12 text-base font-medium"
            >
              Plan Another Trip
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
