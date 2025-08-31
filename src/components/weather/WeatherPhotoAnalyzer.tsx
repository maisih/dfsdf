import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Camera, Loader2, CloudRain, AlertTriangle, Shield, Wrench } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useProject } from "@/contexts/ProjectContext";

interface WeatherData {
  condition: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
}

const WeatherPhotoAnalyzer = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [analysis, setAnalysis] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const { selectedProject } = useProject();
  const { toast } = useToast();

  // Mock current weather - in real app this would come from weather API
  const getCurrentWeather = (): WeatherData => ({
    condition: "Partly Cloudy",
    temperature: 22,
    humidity: 65,
    windSpeed: 12
  });

  const analyzeWeatherPhoto = async () => {
    if (!imageUrl.trim() || !selectedProject) return;

    const weather = getCurrentWeather();
    setCurrentWeather(weather);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-weather-photo-analyzer', {
        body: { 
          imageUrl: imageUrl.trim(),
          currentWeather: weather,
          projectId: selectedProject.id
        }
      });

      if (error) throw error;

      setAnalysis(data.analysis);

      toast({
        title: "Weather Photo Analysis Complete",
        description: "AI has analyzed weather-related issues and provided solutions."
      });

    } catch (error) {
      console.error('Weather photo analysis error:', error);
      toast({
        title: "Error",
        description: "Failed to analyze photo. Please check the URL and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedProject) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          Select a project to analyze weather-related photos
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5 text-blue-500" />
          Weather Photo Analyzer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="weatherImageUrl">Construction Site Photo URL</Label>
          <Input
            id="weatherImageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/construction-site-photo.jpg"
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground">
            Analyze photos for weather damage, protection issues, and safety hazards
          </p>
        </div>

        {currentWeather && (
          <div className="p-3 bg-muted rounded-lg">
            <h4 className="text-sm font-semibold mb-2">Current Weather Context</h4>
            <div className="grid grid-cols-2 gap-2">
              <Badge variant="outline" className="justify-center">
                <CloudRain className="h-3 w-3 mr-1" />
                {currentWeather.condition}
              </Badge>
              <Badge variant="outline" className="justify-center">
                {currentWeather.temperature}°C
              </Badge>
              <Badge variant="outline" className="justify-center">
                Humidity: {currentWeather.humidity}%
              </Badge>
              <Badge variant="outline" className="justify-center">
                Wind: {currentWeather.windSpeed} km/h
              </Badge>
            </div>
          </div>
        )}

        <Button 
          onClick={analyzeWeatherPhoto} 
          disabled={!imageUrl.trim() || isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing Weather Issues...
            </>
          ) : (
            <>
              <Camera className="h-4 w-4 mr-2" />
              Analyze Weather-Related Issues
            </>
          )}
        </Button>

        {imageUrl && (
          <div className="mt-4">
            <img 
              src={imageUrl} 
              alt="Construction site for weather analysis"
              className="w-full h-48 object-cover rounded-lg border"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}

        {analysis && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              Weather Issue Analysis & Solutions
            </h4>
            <div className="text-sm text-muted-foreground whitespace-pre-wrap max-h-80 overflow-y-auto">
              {analysis}
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground p-3 bg-blue-50 rounded-lg">
          <h5 className="font-semibold text-blue-900 mb-1">AI analyzes for:</h5>
          <ul className="space-y-1 text-blue-800">
            <li>• Water damage and flooding issues</li>
            <li>• Wind damage and material displacement</li>
            <li>• Temperature-related structural problems</li>
            <li>• Weather protection deficiencies</li>
            <li>• Safety hazards from weather conditions</li>
            <li>• Preventive measures and solutions</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherPhotoAnalyzer;