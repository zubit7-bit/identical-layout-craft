import { Button } from "@/components/ui/button";
import luxuryHotelImage from "@/assets/luxury-hotel.jpg";
import beachImage from "@/assets/beach.jpg";

const destinations = [
  {
    id: 1,
    title: "Luxury Hotels",
    price: "$1,200",
    image: luxuryHotelImage,
  },
  {
    id: 2,
    title: "Beautiful Beaches",
    price: "$800",
    image: beachImage,
  },
];

const RecommendedDestinations = () => {
  return (
    <div className="bg-card rounded-2xl p-8 shadow-sm border border-border">
      <h2 className="text-2xl font-bold mb-6 text-foreground">Recommended Destinations</h2>
      <div className="space-y-4 mb-6">
        {destinations.map((destination) => (
          <div
            key={destination.id}
            className="relative rounded-xl overflow-hidden group cursor-pointer"
          >
            <img
              src={destination.image}
              alt={destination.title}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-end">
              <h3 className="text-white font-semibold text-lg">{destination.title}</h3>
              <span className="text-white font-bold text-xl">{destination.price}</span>
            </div>
          </div>
        ))}
      </div>
      <Button variant="outline" className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground">
        View All
      </Button>
    </div>
  );
};

export default RecommendedDestinations;
