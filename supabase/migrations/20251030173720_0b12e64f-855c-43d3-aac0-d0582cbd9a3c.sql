-- Create itineraries table to store generated travel plans
CREATE TABLE public.itineraries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_query TEXT NOT NULL,
  destination TEXT NOT NULL,
  duration INTEGER NOT NULL,
  budget DECIMAL(10, 2),
  interests TEXT[],
  itinerary_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.itineraries ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read itineraries (public app)
CREATE POLICY "Anyone can view itineraries"
ON public.itineraries
FOR SELECT
USING (true);

-- Create policy to allow anyone to create itineraries
CREATE POLICY "Anyone can create itineraries"
ON public.itineraries
FOR INSERT
WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_itineraries_destination ON public.itineraries(destination);
CREATE INDEX idx_itineraries_created_at ON public.itineraries(created_at DESC);