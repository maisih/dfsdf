import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Wrench, MapPin, Calendar, AlertTriangle } from "lucide-react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

const equipment = [
  {
    id: 1,
    name: "Caterpillar Excavator 320D",
    type: "Heavy Machinery",
    project: "Downtown Office Complex",
    status: "Active",
    location: "Site A - East Wing",
    operator: "John Miller",
    lastMaintenance: "Nov 15, 2024",
    nextMaintenance: "Dec 15, 2024",
    fuelLevel: 85,
    hoursUsed: 1247
  },
  {
    id: 2,
    name: "Liebherr Tower Crane LTM1055",
    type: "Crane",
    project: "Residential Tower Phase 2",
    status: "Active",
    location: "Site B - Central",
    operator: "Sarah Thompson",
    lastMaintenance: "Nov 10, 2024",
    nextMaintenance: "Dec 10, 2024",
    fuelLevel: 92,
    hoursUsed: 856
  },
  {
    id: 3,
    name: "Concrete Mixer Truck",
    type: "Transport",
    project: "Industrial Warehouse",
    status: "Maintenance",
    location: "Maintenance Yard",
    operator: "Unassigned",
    lastMaintenance: "Nov 25, 2024",
    nextMaintenance: "Nov 30, 2024",
    fuelLevel: 45,
    hoursUsed: 2104
  },
  {
    id: 4,
    name: "Bobcat Skid Steer S650",
    type: "Light Machinery",
    project: "Shopping Center Renovation",
    status: "Idle",
    location: "Storage Yard",
    operator: "Mike Rodriguez",
    lastMaintenance: "Nov 20, 2024",
    nextMaintenance: "Dec 20, 2024",
    fuelLevel: 67,
    hoursUsed: 743
  },
  {
    id: 5,
    name: "Genie Scissor Lift GS-3232",
    type: "Access Equipment",
    project: "Downtown Office Complex",
    status: "Active",
    location: "Site A - Interior",
    operator: "Alex Chen",
    lastMaintenance: "Nov 12, 2024",
    nextMaintenance: "Dec 12, 2024",
    fuelLevel: 78,
    hoursUsed: 512
  }
];

const Equipment = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-success/10 text-success border-success/20";
      case "Idle":
        return "bg-warning/10 text-warning border-warning/20";
      case "Maintenance":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "Out of Service":
        return "bg-muted/10 text-muted-foreground border-muted/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const getFuelLevelColor = (level: number) => {
    if (level < 25) return "text-destructive";
    if (level < 50) return "text-warning";
    return "text-success";
  };

  const isMaintenanceDue = (nextMaintenance: string) => {
    const maintenanceDate = new Date(nextMaintenance);
    const today = new Date();
    const daysDiff = Math.ceil((maintenanceDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return daysDiff <= 7;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Equipment</h1>
              <p className="text-muted-foreground">Manage construction equipment and machinery</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Maintenance Schedule</Button>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Equipment
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {equipment.map((item) => (
              <Card key={item.id} className="shadow-soft hover:shadow-medium transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Wrench className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold text-foreground">{item.name}</h3>
                        <Badge variant="outline" className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                        {isMaintenanceDue(item.nextMaintenance) && (
                          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                            Maintenance Due
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">{item.type}</span>
                        <span>•</span>
                        <span>{item.project}</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          <div>
                            <span className="text-sm text-muted-foreground">Location</span>
                            <p className="font-medium">{item.location}</p>
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-sm text-muted-foreground">Operator</span>
                          <p className="font-medium">{item.operator}</p>
                        </div>
                        
                        <div>
                          <span className="text-sm text-muted-foreground">Fuel Level</span>
                          <p className={`font-medium ${getFuelLevelColor(item.fuelLevel)}`}>
                            {item.fuelLevel}%
                          </p>
                        </div>
                        
                        <div>
                          <span className="text-sm text-muted-foreground">Hours Used</span>
                          <p className="font-medium">{item.hoursUsed.toLocaleString()}h</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <div>
                            <span className="text-muted-foreground">Last Maintenance: </span>
                            <span className="font-medium text-foreground">{item.lastMaintenance}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <div>
                            <span className="text-muted-foreground">Next Maintenance: </span>
                            <span className={`font-medium ${isMaintenanceDue(item.nextMaintenance) ? 'text-warning' : 'text-foreground'}`}>
                              {item.nextMaintenance}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {item.fuelLevel < 25 && (
                        <div className="mt-4 p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
                          <div className="flex items-center gap-2 text-sm text-destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <span className="font-medium">Low Fuel Alert:</span>
                            <span>Equipment needs refueling soon</span>
                          </div>
                        </div>
                      )}
                      
                      {isMaintenanceDue(item.nextMaintenance) && (
                        <div className="mt-4 p-3 bg-warning/5 border border-warning/20 rounded-lg">
                          <div className="flex items-center gap-2 text-sm text-warning">
                            <AlertTriangle className="h-4 w-4" />
                            <span className="font-medium">Maintenance Due:</span>
                            <span>Schedule maintenance within 7 days</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">Log Entry</Button>
                      <Button variant="outline" size="sm">History</Button>
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

export default Equipment;