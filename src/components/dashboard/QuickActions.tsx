import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, FileText, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AddProjectDialog from "@/components/dialogs/AddProjectDialog";
import AddTaskDialog from "@/components/dialogs/AddTaskDialog";

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          <AddProjectDialog />
          <AddTaskDialog />
          
          <Button 
            variant="outline" 
            className="gap-2 h-auto py-3"
            onClick={() => navigate('/documents')}
          >
            <FileText className="h-4 w-4" />
            Add Document
          </Button>
          
          <Button 
            variant="outline" 
            className="gap-2 h-auto py-3"
            onClick={() => navigate('/schedule')}
          >
            <Calendar className="h-4 w-4" />
            View Progress
          </Button>
          
          <Button 
            variant="outline" 
            className="gap-2 h-auto py-3 col-span-2"
            onClick={() => navigate('/budget')}
          >
            <DollarSign className="h-4 w-4" />
            Track Expenses
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;