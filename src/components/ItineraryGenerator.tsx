import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const ItineraryGenerator = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!query.trim()) {
      toast({
        title: "Please enter a travel query",
        description: "Try something like 'Plan a 5-day budget trip to Bali under ₹60,000'",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-itinerary', {
        body: { query }
      });

      if (error) throw error;

      toast({
        title: "Itinerary Generated!",
        description: `Your ${data.destination} trip is ready`,
      });

      navigate('/results', { state: { itinerary: data } });
    } catch (error) {
      console.error('Error generating itinerary:', error);
      toast({
        title: "Failed to generate itinerary",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card rounded-2xl p-8 shadow-sm border border-border">
      <h2 className="text-2xl font-bold mb-6 text-foreground">Generate AI Itinerary</h2>
      <div className="space-y-4">
        <div>
          <Textarea
            placeholder="Example: Plan a 5-day budget trip to Bali under ₹60,000 with adventure activities"
            className="w-full min-h-[120px] resize-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={loading}
          />
          <p className="text-sm text-muted-foreground mt-2">
            Describe your dream trip in natural language
          </p>
        </div>
        <Button 
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground h-12 text-base font-medium"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Itinerary"
          )}
        </Button>
      </div>
    </div>
  );
};

export default ItineraryGenerator;
