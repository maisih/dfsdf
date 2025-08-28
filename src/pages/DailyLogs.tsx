import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Users, Truck, Cloud } from "lucide-react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { useProject } from "@/contexts/ProjectContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const DailyLogs = () => {
  const { selectedProject } = useProject();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedProject) {
      loadLogs();
    } else {
      setLogs([]);
    }
  }, [selectedProject]);

  const loadLogs = async () => {
    if (!selectedProject) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('project_id', selectedProject.id)
        .order('log_date', { ascending: false });
      
      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error loading daily logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (weather: string) => {
    if (weather && weather.toLowerCase().includes('rain')) {
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

          {!selectedProject ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Please select a project to view daily logs</p>
            </div>
          ) : loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading daily logs...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No daily logs found for this project</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {logs.map((log) => (
                <Card key={log.id} className="shadow-soft hover:shadow-medium transition-all duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-primary" />
                          {new Date(log.log_date).toLocaleDateString()}
                        </CardTitle>
                        <p className="text-muted-foreground">{selectedProject.name}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {getWeatherIcon(log.weather)}
                        <span>{log.weather || 'No weather data'}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {log.work_performed && (
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Work Performed</h4>
                        <p className="text-sm text-muted-foreground">{log.work_performed}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Manpower
                        </h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Laborers:</span>
                            <span className="font-medium">{log.laborers || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Operators:</span>
                            <span className="font-medium">{log.operators || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Supervisors:</span>
                            <span className="font-medium">{log.supervisors || 0}</span>
                          </div>
                        </div>
                      </div>

                      {log.equipment_used && (
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Equipment Used</h4>
                          <p className="text-sm text-muted-foreground">{log.equipment_used}</p>
                        </div>
                      )}

                      {log.deliveries && (
                        <div>
                          <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                            <Truck className="h-4 w-4" />
                            Deliveries
                          </h4>
                          <p className="text-sm text-muted-foreground">{log.deliveries}</p>
                        </div>
                      )}
                    </div>

                    {log.issues && (
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Issues & Notes</h4>
                        <p className="text-sm text-muted-foreground">{log.issues}</p>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-4 border-t">
                      <div className="text-sm text-muted-foreground">
                        Logged on: <span className="font-medium text-foreground">{new Date(log.created_at).toLocaleDateString()}</span>
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
          )}
        </main>
      </div>
    </div>
  );
};

export default DailyLogs;