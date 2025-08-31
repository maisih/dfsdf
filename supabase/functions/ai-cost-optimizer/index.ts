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

    // Get project financial data
    const { data: project } = await supabaseClient
      .from('projects')
      .select(`
        *,
        tasks(*),
        materials(*),
        expenses(*)
      `)
      .eq('id', projectId)
      .single();

    if (!project) {
      throw new Error('Project not found');
    }

    // Calculate cost breakdown
    const materialCosts = project.materials?.reduce((sum, material) => 
      sum + (parseFloat(material.unit_cost) || 0) * (parseFloat(material.quantity) || 0), 0
    ) || 0;

    const expensesByCategory = project.expenses?.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + parseFloat(expense.amount);
      return acc;
    }, {}) || {};

    const taskCosts = project.tasks?.reduce((sum, task) => 
      sum + (parseFloat(task.cost) || 0), 0
    ) || 0;

    const budgetRemaining = (project.budget || 0) - (project.spent || 0);
    const completedProgress = project.progress || 0;
    const estimatedTotalCost = completedProgress > 0 ? 
      (project.spent || 0) / (completedProgress / 100) : project.budget;

    const optimizationPrompt = `Analyze this construction project's costs and provide optimization recommendations:

Project: ${project.name}
Total Budget: $${project.budget || 0}
Spent So Far: $${project.spent || 0}
Remaining Budget: $${budgetRemaining}
Progress: ${completedProgress}%

Cost Breakdown:
- Material Costs: $${materialCosts}
- Task Costs: $${taskCosts}
- Expense Categories: ${Object.entries(expensesByCategory).map(([cat, cost]) => 
  `${cat}: $${cost}`).join(', ')}

Projected Total Cost: $${estimatedTotalCost}
Potential Overrun: ${estimatedTotalCost > project.budget ? 
  `$${estimatedTotalCost - project.budget}` : 'None'}

Provide:
1. Cost optimization opportunities
2. Budget reallocation suggestions  
3. Cost-saving measures
4. Risk areas for cost overruns
5. Recommended actions with potential savings
6. Alternative material/supplier suggestions`;

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('DEEPSEEK_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-reasoner',
        messages: [
          { role: 'system', content: 'You are an expert construction cost analyst and optimization specialist. Provide practical, actionable cost-saving recommendations.' },
          { role: 'user', content: optimizationPrompt }
        ],
        max_tokens: 1500,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    const optimization = data.choices[0].message.content;

    return new Response(JSON.stringify({ 
      optimization,
      costMetrics: {
        totalBudget: project.budget || 0,
        spent: project.spent || 0,
        remaining: budgetRemaining,
        materialCosts,
        taskCosts,
        expensesByCategory,
        projectedOverrun: Math.max(0, estimatedTotalCost - (project.budget || 0))
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-cost-optimizer:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to optimize costs',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});