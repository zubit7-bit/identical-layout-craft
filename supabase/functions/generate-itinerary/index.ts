import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    console.log('Received query:', query);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Step 1: Extract structured data from natural language query
    const extractionResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are a travel data extraction assistant. Extract destination, duration (in days), budget, and interests from user queries. Return only valid JSON.'
          },
          {
            role: 'user',
            content: query
          }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'extract_travel_data',
              description: 'Extract travel parameters from user query',
              parameters: {
                type: 'object',
                properties: {
                  destination: { type: 'string', description: 'The travel destination' },
                  duration: { type: 'integer', description: 'Number of days for the trip' },
                  budget: { type: 'number', description: 'Budget in the local currency' },
                  interests: { 
                    type: 'array', 
                    items: { type: 'string' },
                    description: 'List of user interests (e.g., adventure, culture, food, relaxation)'
                  }
                },
                required: ['destination', 'duration'],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'extract_travel_data' } }
      }),
    });

    if (!extractionResponse.ok) {
      const errorText = await extractionResponse.text();
      console.error('AI extraction error:', extractionResponse.status, errorText);
      throw new Error('Failed to extract travel parameters');
    }

    const extractionData = await extractionResponse.json();
    console.log('Extraction response:', JSON.stringify(extractionData));

    const toolCall = extractionData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error('No tool call in AI response');
    }

    const extractedData = JSON.parse(toolCall.function.arguments);
    console.log('Extracted data:', extractedData);

    // Step 2: Generate detailed itinerary
    const itineraryPrompt = `Create a detailed ${extractedData.duration}-day travel itinerary for ${extractedData.destination}.
${extractedData.budget ? `Budget: ₹${extractedData.budget}` : ''}
${extractedData.interests?.length ? `Interests: ${extractedData.interests.join(', ')}` : ''}

Generate a day-by-day itinerary with specific activities, attractions, and recommendations. Include morning, afternoon, and evening activities for each day. Be specific and practical.`;

    const itineraryResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are an expert travel planner. Create detailed, practical day-by-day itineraries with specific activities, timings, and recommendations.'
          },
          {
            role: 'user',
            content: itineraryPrompt
          }
        ],
      }),
    });

    if (!itineraryResponse.ok) {
      const errorText = await itineraryResponse.text();
      console.error('AI itinerary error:', itineraryResponse.status, errorText);
      throw new Error('Failed to generate itinerary');
    }

    const itineraryData = await itineraryResponse.json();
    const itineraryText = itineraryData.choices?.[0]?.message?.content;

    if (!itineraryText) {
      throw new Error('No itinerary generated');
    }

    // Parse itinerary into structured format
    const days = [];
    const dayRegex = /Day (\d+):([\s\S]*?)(?=Day \d+:|$)/gi;
    let match;
    
    while ((match = dayRegex.exec(itineraryText)) !== null) {
      const dayNumber = parseInt(match[1]);
      const content = match[2].trim();
      
      // Extract activities
      const activities = content
        .split('\n')
        .filter(line => line.trim().length > 0)
        .map(line => line.replace(/^[•\-*]\s*/, '').trim())
        .filter(line => line.length > 0);

      days.push({
        day: dayNumber,
        title: `Day ${dayNumber}`,
        activities: activities.slice(0, 5) // Limit to 5 activities per day
      });
    }

    // If no structured days found, create a simple structure
    if (days.length === 0) {
      for (let i = 1; i <= extractedData.duration; i++) {
        days.push({
          day: i,
          title: `Day ${i}`,
          activities: [`Exploring ${extractedData.destination}`]
        });
      }
    }

    const result = {
      ...extractedData,
      days,
      fullItinerary: itineraryText
    };

    // Store in database
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: savedItinerary, error: dbError } = await supabase
      .from('itineraries')
      .insert({
        user_query: query,
        destination: extractedData.destination,
        duration: extractedData.duration,
        budget: extractedData.budget || null,
        interests: extractedData.interests || [],
        itinerary_data: result
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      // Continue even if DB save fails
    }

    console.log('Itinerary generated successfully');

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-itinerary function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : undefined
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
