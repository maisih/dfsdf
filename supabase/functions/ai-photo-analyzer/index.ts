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
    const { imageUrl, projectId, analysisType = 'progress' } = await req.json();
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Get project context
    const { data: project } = await supabaseClient
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    let analysisPrompt = '';
    
    switch (analysisType) {
      case 'progress':
        analysisPrompt = `Analyze this construction site photo for progress assessment. 

Project: ${project?.name || 'Construction Project'}
Current Progress: ${project?.progress || 0}%

Please analyze the image and provide:
1. Estimated completion percentage of visible work
2. Quality assessment of workmanship
3. Safety observations
4. Progress compared to typical timeline
5. Areas that need attention
6. Recommendations for next steps`;
        break;
        
      case 'safety':
        analysisPrompt = `Analyze this construction site photo for safety compliance.

Look for:
1. PPE compliance (hard hats, safety vests, boots)
2. Hazard identification
3. Equipment safety
4. Site organization and cleanliness  
5. OSHA compliance issues
6. Emergency access and egress
7. Safety recommendations`;
        break;
        
      case 'quality':
        analysisPrompt = `Analyze this construction work photo for quality control.

Assess:
1. Workmanship quality
2. Material installation correctness
3. Structural integrity observations
4. Finish quality
5. Code compliance visible issues
6. Defects or problems
7. Quality improvement recommendations`;
        break;
    }

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
        max_tokens: 1000,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    const analysis = data.choices[0].message.content;

    // Store analysis result
    await supabaseClient
      .from('photos')
      .update({ 
        ai_analysis: {
          type: analysisType,
          analysis,
          analyzed_at: new Date().toISOString()
        }
      })
      .eq('file_path', imageUrl);

    return new Response(JSON.stringify({ 
      analysis,
      analysisType,
      imageUrl
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-photo-analyzer:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to analyze photo',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});