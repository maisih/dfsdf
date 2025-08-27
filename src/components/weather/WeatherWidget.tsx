import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, Sun, CloudRain, CloudSnow, MapPin } from "lucide-react";
import { useProject } from "@/contexts/ProjectContext";

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
  const [loading, setLoading] = useState(false);

  // Mock weather data for Morocco cities (in a real app, you'd use an actual weather API)
  const generateMockWeather = (city: string): WeatherData[] => {
    const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Clear'];
    const baseTemp = city === 'Casablanca' ? 20 : city === 'Marrakech' ? 25 : 18;
    
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      return {
        date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        temperature: baseTemp + Math.floor(Math.random() * 10) - 5,
        condition: conditions[Math.floor(Math.random() * conditions.length)],
        humidity: 50 + Math.floor(Math.random() * 30),
        windSpeed: 5 + Math.floor(Math.random() * 15),
        icon: conditions[Math.floor(Math.random() * conditions.length)]
      };
    });
  };

  useEffect(() => {
    if (selectedProject?.location) {
      setLoading(true);
      // Simulate API call delay
      setTimeout(() => {
        setWeatherData(generateMockWeather(selectedProject.location));
        setLoading(false);
      }, 1000);
    }
  }, [selectedProject]);

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return <Sun className="h-6 w-6 text-yellow-500" />;
      case 'partly cloudy':
      case 'cloudy':
        return <Cloud className="h-6 w-6 text-gray-500" />;
      case 'light rain':
      case 'rain':
        return <CloudRain className="h-6 w-6 text-blue-500" />;
      default:
        return <Sun className="h-6 w-6 text-yellow-500" />;
    }
  };

  if (!selectedProject) {
    return (
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Weather Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Select a project to view weather forecast</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="h-5 w-5" />
          7-Day Weather Forecast
        </CardTitle>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          {selectedProject.location}, Morocco
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-muted/20 rounded animate-pulse">
                <div className="h-4 bg-muted rounded w-16"></div>
                <div className="h-6 bg-muted rounded w-6"></div>
                <div className="h-4 bg-muted rounded w-12"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {weatherData.map((day, index) => (
              <div key={index} className={`flex items-center justify-between p-3 rounded-lg transition-colors hover:bg-muted/20 ${index === 0 ? 'bg-primary/5 border border-primary/20' : ''}`}>
                <div className="flex-1">
                  <div className="font-medium text-sm">{day.date}</div>
                  <div className="text-xs text-muted-foreground">{day.condition}</div>
                </div>
                <div className="flex items-center gap-3">
                  {getWeatherIcon(day.condition)}
                  <div className="text-right">
                    <div className="font-bold">{day.temperature}°C</div>
                    <div className="text-xs text-muted-foreground">{day.humidity}% humidity</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!loading && weatherData.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Wind Speed:</span>
                <span className="ml-2 font-medium">{weatherData[0].windSpeed} km/h</span>
              </div>
              <div>
                <span className="text-muted-foreground">Humidity:</span>
                <span className="ml-2 font-medium">{weatherData[0].humidity}%</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;