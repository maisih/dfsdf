import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Clock, User, Calendar } from "lucide-react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

const timesheets = [
  {
    id: 1,
    employee: "John Smith",
    project: "Downtown Office Complex",
    date: "Nov 27, 2024",
    hoursWorked: 8.5,
    overtime: 0.5,
    activity: "Foundation concrete work",
    status: "Approved"
  },
  {
    id: 2,
    employee: "Mike Johnson",
    project: "Residential Tower Phase 2",
    date: "Nov 27, 2024",
    hoursWorked: 9.0,
    overtime: 1.0,
    activity: "Electrical installation",
    status: "Pending"
  },
  {
    id: 3,
    employee: "Sarah Wilson",
    project: "Industrial Warehouse",
    date: "Nov 27, 2024",
    hoursWorked: 8.0,
    overtime: 0,
    activity: "Quality inspection",
    status: "Approved"
  },
  {
    id: 4,
    employee: "Alex Brown",
    project: "Shopping Center Renovation",
    date: "Nov 26, 2024",
    hoursWorked: 7.5,
    overtime: 0,
    activity: "Material coordination",
    status: "Rejected"
  },
  {
    id: 5,
    employee: "Emily Davis",
    project: "Downtown Office Complex",
    date: "Nov 26, 2024",
    hoursWorked: 8.0,
    overtime: 0,
    activity: "Site supervision",
    status: "Approved"
  }
];

const Timesheets = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-success/10 text-success border-success/20";
      case "Pending":
        return "bg-warning/10 text-warning border-warning/20";
      case "Rejected":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const calculateTotalHours = (regular: number, overtime: number) => {
    return regular + overtime;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Timesheets</h1>
              <p className="text-muted-foreground">Track work hours and attendance</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Weekly Report</Button>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Timesheet
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {timesheets.map((timesheet) => (
              <Card key={timesheet.id} className="shadow-soft hover:shadow-medium transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <User className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold text-foreground">{timesheet.employee}</h3>
                        <Badge variant="outline" className={getStatusColor(timesheet.status)}>
                          {timesheet.status}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4">{timesheet.project}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <div>
                            <span className="text-sm text-muted-foreground">Date</span>
                            <p className="font-medium">{timesheet.date}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-primary" />
                          <div>
                            <span className="text-sm text-muted-foreground">Regular Hours</span>
                            <p className="font-medium">{timesheet.hoursWorked}h</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-warning" />
                          <div>
                            <span className="text-sm text-muted-foreground">Overtime</span>
                            <p className="font-medium">{timesheet.overtime}h</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-success" />
                          <div>
                            <span className="text-sm text-muted-foreground">Total Hours</span>
                            <p className="font-medium">{calculateTotalHours(timesheet.hoursWorked, timesheet.overtime)}h</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <span className="text-sm text-muted-foreground">Activity: </span>
                        <span className="font-medium text-foreground">{timesheet.activity}</span>
                      </div>
                      
                      {timesheet.status === "Rejected" && (
                        <div className="p-3 bg-destructive/5 border border-destructive/20 rounded-lg mb-4">
                          <p className="text-sm text-destructive">
                            <strong>Rejection Reason:</strong> Missing clock-out time documentation
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">View Details</Button>
                      {timesheet.status === "Pending" && (
                        <>
                          <Button variant="outline" size="sm" className="text-success hover:text-success">
                            Approve
                          </Button>
                          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                            Reject
                          </Button>
                        </>
                      )}
                      {timesheet.status === "Rejected" && (
                        <Button variant="outline" size="sm">Edit</Button>
                      )}
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

export default Timesheets;