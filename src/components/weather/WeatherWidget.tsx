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

  const weatherCodeToCondition = (code: number): string => {
    if ([0].includes(code)) return 'Clear';
    if ([1,2,3].includes(code)) return 'Partly Cloudy';
    if ([45,48].includes(code)) return 'Fog';
    if ([51,53,55,56,57].includes(code)) return 'Drizzle';
    if ([61,63,65,80,81,82].includes(code)) return 'Rain';
    if ([66,67].includes(code)) return 'Freezing Rain';
    if ([71,73,75,77,85,86].includes(code)) return 'Snow';
    if ([95,96,99].includes(code)) return 'Storm';
    return 'Cloudy';
  };

  const fetchAccurateWeather = async (city: string): Promise<WeatherData[]> => {
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);
    const geo = await geoRes.json();
    const lat = geo?.results?.[0]?.latitude;
    const lon = geo?.results?.[0]?.longitude;
    if (lat == null || lon == null) return [];

    const params = new URLSearchParams({
      latitude: String(lat),
      longitude: String(lon),
      timezone: 'auto',
      daily: 'weathercode,temperature_2m_max,temperature_2m_min,windspeed_10m_max',
      hourly: 'relative_humidity_2m'
    });
    const wxRes = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
    const wx = await wxRes.json();

    const days: WeatherData[] = (wx?.daily?.time || []).slice(0,5).map((isoDate: string, idx: number) => {
      const dateObj = new Date(isoDate);
      let humidity = 0;
      if (wx?.hourly?.time && wx?.hourly?.relative_humidity_2m) {
        const target = new Date(isoDate); target.setHours(12,0,0,0);
        let bestDiff = Infinity; let bestHum = 0;
        for (let i=0;i<wx.hourly.time.length;i++) {
          const t = new Date(wx.hourly.time[i]);
          if (t.toDateString() !== dateObj.toDateString()) continue;
          const diff = Math.abs(t.getTime() - target.getTime());
          if (diff < bestDiff) { bestDiff = diff; bestHum = wx.hourly.relative_humidity_2m[i] ?? 0; }
        }
        humidity = bestHum;
      }

      const tmax = wx?.daily?.temperature_2m_max?.[idx] ?? 0;
      const tmin = wx?.daily?.temperature_2m_min?.[idx] ?? 0;
      const wind = wx?.daily?.windspeed_10m_max?.[idx] ?? 0;
      const code = wx?.daily?.weathercode?.[idx] ?? 3;
      const condition = weatherCodeToCondition(code);

      return {
        date: dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        temperature: Math.round((tmax + tmin) / 2),
        condition,
        humidity: Math.round(humidity),
        windSpeed: Math.round(wind),
        icon: condition
      };
    });

    return days;
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
    let aborted = false;
    const run = async () => {
      if (!selectedProject?.location) {
        setWeatherData([]); setLoading(false); return;
      }
      setLoading(true);
      try {
        const data = await fetchAccurateWeather(selectedProject.location);
        if (!aborted) setWeatherData(data);
      } catch {
        if (!aborted) setWeatherData([]);
      } finally {
        if (!aborted) setLoading(false);
      }
    };
    run();
    return () => { aborted = true; };
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
