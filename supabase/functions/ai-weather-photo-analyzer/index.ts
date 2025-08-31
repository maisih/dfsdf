import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl, currentWeather, projectId } = await req.json();
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const analysisPrompt = `Analyze this construction site photo for weather-related issues and provide solutions:

Current Weather Context:
- Condition: ${currentWeather?.condition || 'Unknown'}
- Temperature: ${currentWeather?.temperature || 'Unknown'}°C
- Humidity: ${currentWeather?.humidity || 'Unknown'}%
- Wind Speed: ${currentWeather?.windSpeed || 'Unknown'} km/h

Please analyze the image for:

1. WEATHER DAMAGE ASSESSMENT:
   - Water damage (flooding, leaks, moisture)
   - Wind damage (blown materials, structural issues)
   - Temperature effects (cracking, expansion/contraction)
   - Erosion or soil issues from rain

2. WEATHER PROTECTION DEFICIENCIES:
   - Missing or inadequate weather barriers
   - Uncovered materials or equipment
   - Poor drainage systems
   - Insufficient site weatherproofing

3. WEATHER-RELATED SAFETY HAZARDS:
   - Slippery surfaces from rain/ice
   - Unstable structures due to weather
   - Electrical hazards in wet conditions
   - Poor visibility conditions

4. MATERIAL CONDITION ASSESSMENT:
   - Weather damage to stored materials
   - Quality degradation from exposure
   - Rust, corrosion, or deterioration
   - Proper storage and protection status

5. IMMEDIATE SOLUTIONS & ACTIONS:
   - Emergency weather protection measures
   - Material salvage and protection steps
   - Safety improvements needed
   - Drainage and water management

6. PREVENTIVE RECOMMENDATIONS:
   - Better weather protection systems
   - Improved material storage solutions
   - Site preparation for future weather
   - Long-term weatherproofing strategies

7. COST IMPACT & URGENCY:
   - Estimated damage or risk level
   - Priority of required actions
   - Potential cost if not addressed
   - Timeline for implementation

Provide specific, actionable solutions with step-by-step implementation guidance.`;

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('DEEPSEEK_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-reasoner',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: analysisPrompt },
              { type: 'image_url', image_url: { url: imageUrl } }
            ]
          }
        ],
        max_tokens: 2000,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    const analysis = data.choices[0].message.content;

    // Store weather-specific analysis
    await supabaseClient
      .from('photos')
      .update({ 
        ai_analysis: {
          type: 'weather_analysis',
          analysis,
          weather_context: currentWeather,
          analyzed_at: new Date().toISOString()
        }
      })
      .eq('file_path', imageUrl);

    return new Response(JSON.stringify({ 
      analysis,
      weatherContext: currentWeather,
      imageUrl,
      analysisType: 'weather_analysis'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-weather-photo-analyzer:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to analyze weather-related photo issues',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});