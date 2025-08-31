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
    const { weatherData, projectLocation, projectType = 'construction' } = await req.json();
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const analysisPrompt = `Analyze this 7-day weather forecast for construction project risk assessment:

Location: ${projectLocation}
Project Type: ${projectType}

Weather Forecast:
${weatherData.map((day: any, index: number) => 
  `Day ${index + 1} (${day.date}): ${day.condition}, ${day.temperature}°C, Humidity: ${day.humidity}%, Wind: ${day.windSpeed} km/h`
).join('\n')}

Average Wind Speed: ${weatherData[0]?.windSpeed || 'N/A'} km/h
Average Humidity: ${weatherData[0]?.humidity || 'N/A'}%

Provide detailed analysis including:

1. CONSTRUCTION RISK ASSESSMENT:
   - High/Medium/Low risk days and why
   - Specific weather hazards (wind, rain, temperature, humidity)
   - Work stoppage recommendations
   - Equipment and material protection needs

2. DAILY WORK RECOMMENDATIONS:
   - Safe work activities for each day
   - Activities to avoid or postpone
   - Optimal work hours considering weather

3. SAFETY PRECAUTIONS:
   - PPE requirements for weather conditions
   - Site safety measures needed
   - Emergency weather protocols

4. MATERIAL & EQUIPMENT PROTECTION:
   - Materials that need protection
   - Equipment storage recommendations
   - Concrete/masonry work viability

5. PRODUCTIVITY OPTIMIZATION:
   - Best days for different construction activities
   - Weather-dependent task scheduling
   - Indoor vs outdoor work planning

6. COST IMPACT ANALYSIS:
   - Potential weather-related delays
   - Additional protection costs
   - Optimal resource allocation

Provide specific, actionable recommendations for construction site management.`;

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('DEEPSEEK_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-reasoner',
        messages: [
          { role: 'system', content: 'You are an expert construction weather analyst and safety specialist. Provide detailed, actionable weather risk assessments for construction projects.' },
          { role: 'user', content: analysisPrompt }
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

    // Calculate risk scores
    const riskFactors = {
      windRisk: weatherData.some((day: any) => day.windSpeed > 25) ? 'high' : 
               weatherData.some((day: any) => day.windSpeed > 15) ? 'medium' : 'low',
      rainRisk: weatherData.some((day: any) => day.condition.toLowerCase().includes('rain') || 
                                              day.condition.toLowerCase().includes('storm')) ? 'high' : 'low',
      temperatureRisk: weatherData.some((day: any) => day.temperature < 5 || day.temperature > 40) ? 'high' : 
                      weatherData.some((day: any) => day.temperature < 10 || day.temperature > 35) ? 'medium' : 'low',
      humidityRisk: weatherData.some((day: any) => day.humidity > 85) ? 'medium' : 'low'
    };

    const workableDays = weatherData.filter((day: any) => 
      !day.condition.toLowerCase().includes('storm') && 
      !day.condition.toLowerCase().includes('heavy rain') &&
      day.windSpeed < 30
    ).length;

    return new Response(JSON.stringify({ 
      analysis,
      riskFactors,
      workableDays,
      totalDays: weatherData.length,
      recommendations: {
        highRiskDays: weatherData.filter((day: any) => 
          day.condition.toLowerCase().includes('storm') || 
          day.condition.toLowerCase().includes('heavy rain') ||
          day.windSpeed > 25
        ).length,
        optimalWorkDays: workableDays,
        weatherAlerts: riskFactors.windRisk === 'high' || riskFactors.rainRisk === 'high'
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-weather-analyzer:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to analyze weather risks',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});