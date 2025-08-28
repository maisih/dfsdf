import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, Clock, MapPin, Users } from "lucide-react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import AddEventDialog from "@/components/dialogs/AddEventDialog";
import { useProject } from "@/contexts/ProjectContext";
import { useEffect, useState } from "react";
import { format } from "date-fns";

const Schedule = () => {
  const { selectedProject } = useProject();
  const [events, setEvents] = useState<any[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const handleEventAdded = (newEvent: any) => {
    setEvents([...events, newEvent]);
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "Meeting":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Inspection":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Delivery":
        return "bg-green-100 text-green-800 border-green-200";
      case "Milestone":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Safety":
        return "bg-red-100 text-red-800 border-red-200";
      case "Training":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const isEventUpcoming = (eventDate: string) => {
    const today = new Date();
    const event = new Date(eventDate);
    return event >= today;
  };

  const sortedEvents = events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Project Schedule</h1>
              <p className="text-muted-foreground">Manage upcoming events and project timeline</p>
            </div>
            <Button className="gap-2" onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4" />
              Schedule Event
            </Button>
          </div>

          {!selectedProject ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">No Project Selected</h2>
              <p className="text-muted-foreground">Please select a project to manage the schedule</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {/* Project Timeline Overview */}
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {selectedProject.name} - Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Start Date</div>
                      <div className="text-lg font-semibold text-foreground">
                        {selectedProject.start_date 
                          ? format(new Date(selectedProject.start_date), 'MMM dd, yyyy')
                          : 'Not set'
                        }
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">End Date</div>
                      <div className="text-lg font-semibold text-foreground">
                        {selectedProject.end_date 
                          ? format(new Date(selectedProject.end_date), 'MMM dd, yyyy')
                          : 'Not set'
                        }
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Progress</div>
                      <div className="text-lg font-semibold text-foreground">
                        {selectedProject.progress || 0}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Events */}
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Upcoming Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {events.length === 0 ? (
                    <div className="text-center py-12">
                      <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">No Events Scheduled</h3>
                      <p className="text-muted-foreground mb-4">Schedule your first event to get started</p>
                      <Button className="gap-2" onClick={() => setShowAddDialog(true)}>
                        <Plus className="h-4 w-4" />
                        Schedule Event
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {sortedEvents.map((event) => (
                        <div key={event.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <div className="text-sm font-semibold text-foreground">
                                {format(new Date(event.date), 'MMM')}
                              </div>
                              <div className="text-lg font-bold text-primary">
                                {format(new Date(event.date), 'dd')}
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-foreground">{event.title}</h4>
                                <Badge variant="outline" className={getEventTypeColor(event.type)}>
                                  {event.type}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{event.description}</p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {event.time}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {format(new Date(event.date), 'EEEE, MMM dd, yyyy')}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge 
                              variant={isEventUpcoming(event.date) ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {isEventUpcoming(event.date) ? "Upcoming" : "Past"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Period Summary */}
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    This Month Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary">
                        {events.filter(e => isEventUpcoming(e.date)).length}
                      </div>
                      <div className="text-sm text-muted-foreground">Upcoming Events</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">
                        {events.filter(e => e.type === 'Meeting').length}
                      </div>
                      <div className="text-sm text-muted-foreground">Meetings</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">
                        {events.filter(e => e.type === 'Milestone').length}
                      </div>
                      <div className="text-sm text-muted-foreground">Milestones</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">
                        {events.filter(e => e.type === 'Inspection').length}
                      </div>
                      <div className="text-sm text-muted-foreground">Inspections</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          <AddEventDialog
            open={showAddDialog}
            onOpenChange={setShowAddDialog}
            onEventAdded={handleEventAdded}
          />
        </main>
      </div>
    </div>
  );
};

export default Schedule;