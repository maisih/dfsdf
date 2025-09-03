import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import AddEventDialog from "@/components/dialogs/AddEventDialog";
import { useProject } from "@/contexts/ProjectContext";
import { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

const Schedule = () => {
  const { selectedProject } = useProject();
  const [events, setEvents] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [eventsSupported, setEventsSupported] = useState(true);

  useEffect(() => {
    if (selectedProject) {
      loadTasks();
      loadEvents();
    } else {
      setTasks([]);
      setEvents([]);
    }
  }, [selectedProject, currentDate]);

  const loadTasks = async () => {
    if (!selectedProject) return;
    
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', selectedProject.id)
        .not('due_date', 'is', null)
        .order('due_date', { ascending: true });
      
      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const handleEventAdded = (_newEvent: any) => {
    loadEvents();
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

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const loadEvents = async () => {
    if (!selectedProject) return;
    try {
      const { data, error } = await (supabase as any)
        .from('events' as any)
        .select('*')
        .eq('project_id', selectedProject.id)
        .gte('date', monthStart.toISOString())
        .lte('date', monthEnd.toISOString())
        .order('date', { ascending: true });
      if (error) throw error;
      setEventsSupported(true);
      setEvents(data || []);
    } catch (error: any) {
      const msg = error?.message || JSON.stringify(error);
      // 42P01 = undefined_table, or generic "does not exist"
      if (msg.includes('42P01') || msg.toLowerCase().includes('does not exist')) {
        setEventsSupported(false);
        console.warn('Events table not configured; hiding events feature.');
      } else {
        console.error('Error loading events:', msg);
      }
      setEvents([]);
    }
  };

  const getEventsForDay = (day: Date) => {
    const dayEvents = events.filter(event => isSameDay(new Date(event.date), day));
    const dayTasks = tasks.filter(task => task.due_date && isSameDay(new Date(task.due_date), day));
    
    return [
      ...dayEvents,
      ...dayTasks.map(task => ({
        id: `task-${task.id}`,
        title: task.title,
        date: task.due_date,
        type: 'Task',
        description: task.description,
        isTask: true,
        status: task.status,
        priority: task.priority
      }))
    ];
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <div className="hidden md:block fixed left-0 top-16 h-[calc(100vh-4rem)] bg-gradient-surface border-r border-border shadow-soft overflow-y-auto">
          <Sidebar />
        </div>
        <main className="flex-1 md:ml-64 ml-0 p-4 md:p-6 pb-24">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Project Schedule</h1>
              <p className="text-muted-foreground">Monthly calendar view with project events</p>
            </div>
            {eventsSupported && (
              <Button className="gap-2" onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4" />
                Add Event
              </Button>
            )}
          </div>

          {!selectedProject ? (
            <div className="text-center py-12">
              <CalendarIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">No Project Selected</h2>
              <p className="text-muted-foreground">Please select a project to view the schedule</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Calendar Header */}
              <Card className="shadow-soft">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5" />
                      {format(currentDate, 'MMMM yyyy')}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                        Today
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
                    {/* Day headers */}
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div key={day} className="bg-muted/20 p-3 text-center text-sm font-medium text-muted-foreground">
                        {day}
                      </div>
                    ))}
                    
                    {/* Calendar days */}
                    {daysInMonth.map((day) => {
                      const dayEvents = getEventsForDay(day);
                      const isToday = isSameDay(day, new Date());
                      
                      return (
                        <div key={day.toISOString()} className="bg-background min-h-[120px] p-2">
                          <div className={`text-sm font-medium mb-1 ${isToday ? 'text-primary font-bold' : 'text-foreground'}`}>
                            {format(day, 'd')}
                          </div>
                          <div className="space-y-1">
                            {dayEvents.slice(0, 3).map((event, index) => (
                              <div 
                                key={index} 
                                className={`text-xs p-1 rounded text-white truncate ${
                                  event.isTask 
                                    ? event.status === 'completed' 
                                      ? 'bg-success/80' 
                                      : event.priority >= 3 
                                        ? 'bg-destructive/80' 
                                        : 'bg-accent/80'
                                    : 'bg-primary/80'
                                }`}
                              >
                                {event.isTask ? `📋 ${event.title}` : event.title}
                              </div>
                            ))}
                            {dayEvents.length > 3 && (
                              <div className="text-xs text-muted-foreground">
                                +{dayEvents.length - 3} more
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Events Summary */}
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    {eventsSupported ? 'This Month Events' : 'This Month Tasks'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(eventsSupported ? events.length === 0 : true) && tasks.length === 0 ? (
                    <div className="text-center py-8">
                      <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">No Events Scheduled</h3>
                      <p className="text-muted-foreground mb-4">Add your first event to get started</p>
                      <Button onClick={() => setShowAddDialog(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Event
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {[...events, ...tasks.map(task => ({
                        id: `task-${task.id}`,
                        title: task.title,
                        date: task.due_date,
                        type: 'Task',
                        description: task.description,
                        isTask: true,
                        status: task.status,
                        priority: task.priority
                      }))].slice(0, 5).map((event) => (
                        <div key={event.id} className="flex items-center gap-4 p-3 bg-muted/20 rounded-lg">
                          <div className="text-center min-w-[60px]">
                            <div className="text-lg font-bold text-primary">
                              {format(new Date(event.date), 'dd')}
                            </div>
                            <div className="text-xs text-muted-foreground uppercase">
                              {format(new Date(event.date), 'MMM')}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-foreground">
                                {event.isTask ? '📋' : ''} {event.title}
                              </h4>
                              <Badge variant="outline" className={getEventTypeColor(event.type)}>
                                {event.type}
                              </Badge>
                              {event.isTask && event.status && (
                                <Badge variant="outline" className={
                                  event.status === 'completed' ? 'bg-success/10 text-success border-success/20' :
                                  event.status === 'in-progress' ? 'bg-primary/10 text-primary border-primary/20' :
                                  'bg-warning/10 text-warning border-warning/20'
                                }>
                                  {event.status}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{event.description}</p>
                            {event.time && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Time: {event.time}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                      {(events.length + tasks.length) > 5 && (
                        <div className="text-center text-sm text-muted-foreground">
                          And {(events.length + tasks.length) - 5} more events this month...
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
          
          {eventsSupported && (
            <AddEventDialog
              open={showAddDialog}
              onOpenChange={setShowAddDialog}
              onEventAdded={handleEventAdded}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Schedule;
