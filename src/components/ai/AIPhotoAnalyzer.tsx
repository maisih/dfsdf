import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Loader2, Eye, Shield, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useProject } from "@/contexts/ProjectContext";

const AIPhotoAnalyzer = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [analysisType, setAnalysisType] = useState("progress");
  const [analysis, setAnalysis] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { selectedProject } = useProject();
  const { toast } = useToast();

  const analyzePhoto = async () => {
    if (!imageUrl.trim() || !selectedProject) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-photo-analyzer', {
        body: { 
          imageUrl: imageUrl.trim(),
          projectId: selectedProject.id,
          analysisType 
        }
      });

      if (error) throw error;

      setAnalysis(data.analysis);

      toast({
        title: "Photo Analysis Complete",
        description: `AI has analyzed the ${analysisType} aspects of your photo.`
      });

    } catch (error) {
      console.error('Photo analysis error:', error);
      toast({
        title: "Error",
        description: "Failed to analyze photo. Please check the URL and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getAnalysisIcon = (type: string) => {
    switch (type) {
      case 'progress': return <Eye className="h-4 w-4" />;
      case 'safety': return <Shield className="h-4 w-4" />;
      case 'quality': return <CheckCircle className="h-4 w-4" />;
      default: return <Camera className="h-4 w-4" />;
    }
  };

  if (!selectedProject) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          Select a project to analyze photos
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5 text-blue-500" />
          AI Photo Analyzer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="imageUrl">Photo URL</Label>
          <Input
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/construction-photo.jpg"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="analysisType">Analysis Type</Label>
          <Select value={analysisType} onValueChange={setAnalysisType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="progress">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Progress Assessment
                </div>
              </SelectItem>
              <SelectItem value="safety">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Safety Compliance
                </div>
              </SelectItem>
              <SelectItem value="quality">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Quality Control
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={analyzePhoto} 
          disabled={!imageUrl.trim() || isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing Photo...
            </>
          ) : (
            <>
              {getAnalysisIcon(analysisType)}
              <span className="ml-2">Analyze Photo</span>
            </>
          )}
        </Button>

        {imageUrl && (
          <div className="mt-4">
            <img 
              src={imageUrl} 
              alt="Construction photo for analysis"
              className="w-full h-40 object-cover rounded-lg border"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}

        {analysis && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              {getAnalysisIcon(analysisType)}
              {analysisType.charAt(0).toUpperCase() + analysisType.slice(1)} Analysis Report
            </h4>
            <div className="text-sm whitespace-pre-wrap text-muted-foreground">
              {analysis}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIPhotoAnalyzer;