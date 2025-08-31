import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, AlertTriangle, DollarSign, Camera, Brain } from "lucide-react";
import AIProjectAssistant from "@/components/ai/AIProjectAssistant";
import AIRiskAnalyzer from "@/components/ai/AIRiskAnalyzer";
import AICostOptimizer from "@/components/ai/AICostOptimizer";
import WeatherPhotoAnalyzer from "@/components/weather/WeatherPhotoAnalyzer";
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
        <Tabs defaultValue="assistant" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="assistant" className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              Assistant
            </TabsTrigger>
            <TabsTrigger value="risk" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Risk Analysis
            </TabsTrigger>
            <TabsTrigger value="cost" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Cost Optimizer
            </TabsTrigger>
            <TabsTrigger value="photo" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Weather Photos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="assistant">
            <AIProjectAssistant />
          </TabsContent>

          <TabsContent value="risk">
            <AIRiskAnalyzer />
          </TabsContent>

          <TabsContent value="cost">
            <AICostOptimizer />
          </TabsContent>

          <TabsContent value="photo">
            <WeatherPhotoAnalyzer />
          </TabsContent>
        </Tabs>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Features Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Bot className="h-4 w-4 text-blue-500" />
                Project Assistant
              </h4>
              <p className="text-sm text-muted-foreground">
                Chat with AI to get insights about your project progress, budget, timeline, and get personalized recommendations.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                Risk Analysis
              </h4>
              <p className="text-sm text-muted-foreground">
                Automatically identify potential risks, delays, budget overruns, and safety concerns with AI-powered analysis.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-500" />
                Cost Optimization
              </h4>
              <p className="text-sm text-muted-foreground">
                Get AI-powered suggestions to optimize costs, reduce waste, and maximize your project budget efficiency.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Camera className="h-4 w-4 text-purple-500" />
                Weather Photo Analysis
              </h4>
              <p className="text-sm text-muted-foreground">
                Analyze construction photos for weather damage, protection issues, and get AI-powered solutions for weather-related problems.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AI;