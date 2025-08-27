import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Users, Truck, Cloud, AlertTriangle } from "lucide-react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

const dailyLogs = [
  {
    id: 1,
    date: "November 27, 2024",
    project: "Downtown Office Complex",
    weather: "Sunny, 68°F",
    workPerformed: [
      "Completed foundation excavation for east wing",
      "Poured concrete for west wing footings",
      "Installed temporary fencing around work area"
    ],
    manpower: {
      laborers: 12,
      operators: 4,
      supervisors: 2
    },
    equipment: ["2x Excavators", "1x Concrete Mixer", "3x Dump Trucks"],
    deliveries: ["50 tons concrete", "Steel reinforcement bars"],
    issues: ["Minor delay due to permit inspection"],
    loggedBy: "Sarah Johnson"
  },
  {
    id: 2,
    date: "November 26, 2024",
    project: "Residential Tower Phase 2",
    weather: "Cloudy, 72°F",
    workPerformed: [
      "Steel frame installation level 3-4",
      "Electrical conduit routing",
      "Safety inspection completed"
    ],
    manpower: {
      laborers: 8,
      operators: 3,
      supervisors: 1
    },
    equipment: ["1x Tower Crane", "2x Welding Units", "1x Lift"],
    deliveries: ["Steel beams batch #3", "Electrical cables"],
    issues: [],
    loggedBy: "Mike Chen"
  },
  {
    id: 3,
    date: "November 25, 2024",
    project: "Industrial Warehouse",
    weather: "Rainy, 55°F",
    workPerformed: [
      "Limited outdoor work due to rain",
      "Interior electrical work continued",
      "Material organization and inventory"
    ],
    manpower: {
      laborers: 6,
      operators: 1,
      supervisors: 1
    },
    equipment: ["1x Forklift", "Electrical tools"],
    deliveries: [],
    issues: ["Weather delay - outdoor concrete work postponed"],
    loggedBy: "Alex Rodriguez"
  }
];

const DailyLogs = () => {
  const getWeatherIcon = (weather: string) => {
    if (weather.toLowerCase().includes('rain')) {
      return <Cloud className="h-4 w-4 text-blue-500" />;
    }
    return <Cloud className="h-4 w-4 text-yellow-500" />;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Daily Logs</h1>
              <p className="text-muted-foreground">Track daily activities and progress</p>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Log Entry
            </Button>
          </div>

          <div className="grid gap-6">
            {dailyLogs.map((log) => (
              <Card key={log.id} className="shadow-soft hover:shadow-medium transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        {log.date}
                      </CardTitle>
                      <p className="text-muted-foreground">{log.project}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {getWeatherIcon(log.weather)}
                      <span>{log.weather}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Work Performed</h4>
                    <ul className="space-y-1">
                      {log.workPerformed.map((work, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary">•</span>
                          {work}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Manpower
                      </h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Laborers:</span>
                          <span className="font-medium">{log.manpower.laborers}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Operators:</span>
                          <span className="font-medium">{log.manpower.operators}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Supervisors:</span>
                          <span className="font-medium">{log.manpower.supervisors}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Equipment Used</h4>
                      <ul className="space-y-1">
                        {log.equipment.map((item, index) => (
                          <li key={index} className="text-sm text-muted-foreground">{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        Deliveries
                      </h4>
                      {log.deliveries.length > 0 ? (
                        <ul className="space-y-1">
                          {log.deliveries.map((delivery, index) => (
                            <li key={index} className="text-sm text-muted-foreground">{delivery}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">No deliveries</p>
                      )}
                    </div>
                  </div>

                  {log.issues.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                        Issues & Delays
                      </h4>
                      <ul className="space-y-1">
                        {log.issues.map((issue, index) => (
                          <li key={index} className="text-sm text-destructive flex items-start gap-2">
                            <span>•</span>
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      Logged by: <span className="font-medium text-foreground">{log.loggedBy}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">Export</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DailyLogs;