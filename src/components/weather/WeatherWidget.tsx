import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  CloudSnow, 
  CloudLightning, 
  Wind,
  Droplets,
  Thermometer,
  AlertTriangle,
  CheckCircle,
  MapPin
} from "lucide-react";
import { useProject } from "@/contexts/ProjectContext";  
import { useState, useEffect } from "react";

interface WeatherData {
  date: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

const WeatherWidget = () => {
  const { selectedProject } = useProject();
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock weather data for Morocco cities (in a real app, you'd use an actual weather API)
  const generateMockWeather = (city: string): WeatherData[] => {
    const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Clear', 'Heavy Rain', 'Storm'];
    const baseTemp = city === 'Casablanca' ? 20 : city === 'Marrakech' ? 25 : 18;
    
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      return {
        date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        temperature: baseTemp + Math.floor(Math.random() * 10) - 5,
        condition: conditions[Math.floor(Math.random() * conditions.length)],
        humidity: 50 + Math.floor(Math.random() * 30),
        windSpeed: 5 + Math.floor(Math.random() * 25),
        icon: conditions[Math.floor(Math.random() * conditions.length)]
      };
    });
  };


  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'default';
      default: return 'outline';
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return Sun;
      case 'partly cloudy':
      case 'cloudy':
        return Cloud;
      case 'light rain':
      case 'rain':
        return CloudRain;
      case 'heavy rain':
      case 'storm':
        return CloudLightning;
      case 'snow':
        return CloudSnow;
      default:
        return Sun;
    }
  };

  useEffect(() => {
    if (selectedProject?.location) {
      setLoading(true);
      // Simulate API call delay
      setTimeout(() => {
        setWeatherData(generateMockWeather(selectedProject.location));
        setLoading(false);
      }, 1000);
    } else {
      setWeatherData([]);
      setLoading(false);
    }
  }, [selectedProject]);

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="h-5 w-5" />
          Weather Forecast
        </CardTitle>
        {selectedProject?.location && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {selectedProject.location}, Morocco
          </div>
        )}
      </CardHeader>
      <CardContent>
        {!selectedProject ? (
          <p className="text-muted-foreground text-sm">Select a project to view weather forecast</p>
        ) : loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-muted rounded animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Weather Forecast */}
            <div className="space-y-3">
              {weatherData.slice(0, 5).map((day, index) => {
                const Icon = getWeatherIcon(day.condition);
                const isHighRisk = day.condition.toLowerCase().includes('storm') || 
                                 day.condition.toLowerCase().includes('heavy rain') ||
                                 day.windSpeed > 25;
                
                return (
                  <div key={index} className={`flex items-center justify-between p-3 rounded-lg border ${
                    isHighRisk ? 'border-destructive/20 bg-destructive/5' : 'border-border'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Icon className="h-6 w-6 text-muted-foreground" />
                        {isHighRisk && <AlertTriangle className="h-4 w-4 text-destructive" />}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{day.date}</p>
                        <p className="text-xs text-muted-foreground">{day.condition}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            <Thermometer className="h-3 w-3 mr-1" />
                            {day.temperature}°C
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <Droplets className="h-3 w-3 mr-1" />
                            {day.humidity}%
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <Wind className="h-3 w-3 mr-1" />
                            {day.windSpeed} km/h
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {isHighRisk ? (
                        <Badge variant="destructive" className="text-xs">
                          High Risk
                        </Badge>
                      ) : (
                        <Badge variant="default" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Safe
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;
