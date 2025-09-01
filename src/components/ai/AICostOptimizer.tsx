import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Loader2, TrendingDown, PieChart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useProject } from "@/contexts/ProjectContext";

const AICostOptimizer = () => {
  const [optimization, setOptimization] = useState<string>("");
  const [costMetrics, setCostMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { selectedProject } = useProject();
  const { toast } = useToast();

  const optimizeCosts = async () => {
    if (!selectedProject) return;

    setIsLoading(true);
    try {
      // Build optimization prompt with project data
      const optimizationPrompt = `Analyze this construction project's costs and provide optimization recommendations:

Project: ${selectedProject.name}
Total Budget: $${selectedProject.budget || 0}
Spent So Far: $${selectedProject.spent || 0}
Remaining Budget: $${(selectedProject.budget || 0) - (selectedProject.spent || 0)}
Progress: ${selectedProject.progress || 0}%

Provide:
1. Cost optimization opportunities
2. Budget reallocation suggestions  
3. Cost-saving measures
4. Risk areas for cost overruns
5. Recommended actions with potential savings
6. Alternative material/supplier suggestions`;

      const { data, error } = await supabase.functions.invoke('openrouter-assistant', {
        body: { 
          message: optimizationPrompt 
        }
      });

      if (error) throw error;

      setOptimization(data.response);
      
      // Set basic cost metrics from project data
      setCostMetrics({
        totalBudget: selectedProject.budget || 0,
        spent: selectedProject.spent || 0,
        remaining: (selectedProject.budget || 0) - (selectedProject.spent || 0),
        materialCosts: 0,
        taskCosts: 0,
        expensesByCategory: {},
        projectedOverrun: Math.max(0, (selectedProject.spent || 0) - (selectedProject.budget || 0))
      });

      toast({
        title: "Cost Optimization Complete",
        description: "AI has analyzed your costs and provided optimization suggestions."
      });

    } catch (error) {
      console.error('Cost optimization error:', error);
      toast({
        title: "Error",
        description: "Failed to optimize costs. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (!selectedProject) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          Select a project to optimize costs
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-500" />
          AI Cost Optimizer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={optimizeCosts} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Optimizing Costs...
            </>
          ) : (
            <>
              <TrendingDown className="h-4 w-4 mr-2" />
              Optimize Project Costs
            </>
          )}
        </Button>

        {costMetrics && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {formatCurrency(costMetrics.totalBudget)}
                </div>
                <div className="text-sm text-muted-foreground">Total Budget</div>
              </div>
              
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-destructive">
                  {formatCurrency(costMetrics.spent)}
                </div>
                <div className="text-sm text-muted-foreground">Spent</div>
              </div>
              
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(costMetrics.remaining)}
                </div>
                <div className="text-sm text-muted-foreground">Remaining</div>
              </div>
              
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-orange-500">
                  {formatCurrency(costMetrics.projectedOverrun)}
                </div>
                <div className="text-sm text-muted-foreground">Projected Overrun</div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                Cost Breakdown
              </h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">
                  Materials: {formatCurrency(costMetrics.materialCosts)}
                </Badge>
                <Badge variant="outline">
                  Tasks: {formatCurrency(costMetrics.taskCosts)}
                </Badge>
                {Object.entries(costMetrics.expensesByCategory || {}).map(([category, cost]) => (
                  <Badge key={category} variant="secondary">
                    {category}: {formatCurrency(cost as number)}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {optimization && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              Cost Optimization Report
            </h4>
            <div className="text-sm whitespace-pre-wrap text-muted-foreground">
              {optimization}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AICostOptimizer;