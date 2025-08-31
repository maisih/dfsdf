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
    const { projectId } = await req.json();
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Get comprehensive project data
    const { data: project } = await supabaseClient
      .from('projects')
      .select(`
        *,
        tasks(*),
        materials(*),
        expenses(*),
        team_members(*),
        daily_logs(*),
        signals(*)
      `)
      .eq('id', projectId)
      .single();

    if (!project) {
      throw new Error('Project not found');
    }

    // Calculate risk factors
    const overdueTasks = project.tasks?.filter(task => 
      task.status !== 'completed' && new Date(task.due_date) < new Date()
    ).length || 0;

    const budgetUtilization = project.budget ? (project.spent / project.budget) * 100 : 0;
    const openSignals = project.signals?.filter(signal => signal.status === 'open').length || 0;
    const highPrioritySignals = project.signals?.filter(signal => 
      signal.priority === 'high' && signal.status === 'open'
    ).length || 0;

    const daysToDeadline = project.end_date ? 
      Math.ceil((new Date(project.end_date).getTime() - new Date().getTime()) / (1000 * 3600 * 24)) : null;

    const analysisPrompt = `Analyze the construction project risks based on this data:

Project: ${project.name}
Status: ${project.status}
Progress: ${project.progress}%
Budget Utilization: ${budgetUtilization.toFixed(1)}%
Days to Deadline: ${daysToDeadline || 'Unknown'}

Risk Indicators:
- Overdue Tasks: ${overdueTasks}
- Open Safety/Issue Signals: ${openSignals}
- High Priority Signals: ${highPrioritySignals}
- Team Size: ${project.team_members?.length || 0}
- Recent Daily Logs: ${project.daily_logs?.length || 0}

Weather Issues: ${project.daily_logs?.slice(-5).filter(log => 
  log.weather && (log.weather.includes('rain') || log.weather.includes('storm'))
).length || 0} in last 5 days

Please provide:
1. Overall Risk Level (Low/Medium/High/Critical)
2. Top 3 Risk Areas
3. Specific Recommendations
4. Immediate Actions Needed
5. Risk Mitigation Strategies`;

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('DEEPSEEK_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-reasoner',
        messages: [
          { role: 'system', content: 'You are an expert construction project risk analyst. Provide detailed, actionable risk assessments.' },
          { role: 'user', content: analysisPrompt }
        ],
        max_tokens: 1500,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    const analysis = data.choices[0].message.content;

    return new Response(JSON.stringify({ 
      analysis,
      riskMetrics: {
        overdueTasks,
        budgetUtilization: Math.round(budgetUtilization),
        openSignals,
        highPrioritySignals,
        daysToDeadline
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-risk-analyzer:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to analyze risks',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});