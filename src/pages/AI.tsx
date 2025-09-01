import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Brain } from "lucide-react";
import AICostOptimizer from "@/components/ai/AICostOptimizer";
import { useProject } from "@/contexts/ProjectContext";

const AI = () => {
  const { selectedProject } = useProject();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Brain className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">AI Assistant</h1>
          <p className="text-muted-foreground">
            Powered by DeepSeek R1 - Advanced AI for construction project management
          </p>
        </div>
      </div>

      {!selectedProject && (
        <Card>
          <CardContent className="p-8 text-center">
            <Brain className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Select a Project</h3>
            <p className="text-muted-foreground">
              Choose a project from the sidebar to access AI-powered insights and assistance.
            </p>
          </CardContent>
        </Card>
      )}

      {selectedProject && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Cost Optimizer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AICostOptimizer />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Features Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              Cost Optimization
            </h4>
            <p className="text-sm text-muted-foreground">
              Get AI-powered suggestions to optimize costs, reduce waste, and maximize your project budget efficiency for your construction projects.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AI;