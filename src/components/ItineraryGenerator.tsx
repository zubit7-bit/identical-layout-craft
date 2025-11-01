import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ItineraryGenerator = () => {
  return (
    <div className="bg-card rounded-2xl p-8 shadow-sm border border-border">
      <h2 className="text-2xl font-bold mb-6 text-foreground">Generate Itinerary</h2>
      <div className="space-y-4">
        <div>
          <Input
            type="text"
            placeholder="Destination"
            className="w-full"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="text"
            placeholder="Days"
            className="w-full"
          />
          <Input
            type="text"
            placeholder="Budget"
            className="w-full"
          />
        </div>
        <div>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Preferences" />
            </SelectTrigger>
            <SelectContent className="bg-card">
              <SelectItem value="luxury">Luxury</SelectItem>
              <SelectItem value="budget">Budget-Friendly</SelectItem>
              <SelectItem value="adventure">Adventure</SelectItem>
              <SelectItem value="relaxation">Relaxation</SelectItem>
              <SelectItem value="cultural">Cultural</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground h-12 text-base font-medium">
          Generate Itinerary
        </Button>
      </div>
    </div>
  );
};

export default ItineraryGenerator;
