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
    const { message, projectId } = await req.json();
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Get project context
    const { data: project } = await supabaseClient
      .from('projects')
      .select(`
        *,
        tasks(*),
        materials(*),
        expenses(*),
        team_members(*),
        daily_logs(*)
      `)
      .eq('id', projectId)
      .single();

    const contextPrompt = `You are an AI construction project assistant. Here's the current project data:

Project: ${project?.name || 'Unknown'}
Status: ${project?.status || 'Unknown'}
Budget: $${project?.budget || 0}
Spent: $${project?.spent || 0}
Progress: ${project?.progress || 0}%

Tasks: ${project?.tasks?.length || 0} total
Materials: ${project?.materials?.length || 0} items
Team Members: ${project?.team_members?.length || 0} people
Expenses: ${project?.expenses?.length || 0} recorded

Recent Activity: ${project?.daily_logs?.slice(-3).map(log => 
  `${log.log_date}: ${log.work_performed}`
).join('; ') || 'No recent activity'}

Please provide helpful insights, recommendations, and answers based on this project data.`;

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('DEEPSEEK_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-reasoner',
        messages: [
          { role: 'system', content: contextPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ 
      response: aiResponse,
      projectData: {
        name: project?.name,
        progress: project?.progress,
        budget: project?.budget,
        spent: project?.spent
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-project-assistant:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to get AI response',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});