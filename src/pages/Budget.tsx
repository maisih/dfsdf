import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

const budgetData = [
  {
    id: 1,
    project: "Downtown Office Complex",
    totalBudget: 2400000,
    spent: 1800000,
    remaining: 600000,
    categories: [
      { name: "Materials", budgeted: 960000, spent: 720000 },
      { name: "Labor", budgeted: 720000, spent: 540000 },
      { name: "Equipment", budgeted: 480000, spent: 360000 },
      { name: "Other", budgeted: 240000, spent: 180000 }
    ]
  },
  {
    id: 2,
    project: "Residential Tower Phase 2",
    totalBudget: 1800000,
    spent: 950000,
    remaining: 850000,
    categories: [
      { name: "Materials", budgeted: 720000, spent: 380000 },
      { name: "Labor", budgeted: 540000, spent: 285000 },
      { name: "Equipment", budgeted: 360000, spent: 190000 },
      { name: "Other", budgeted: 180000, spent: 95000 }
    ]
  },
  {
    id: 3,
    project: "Industrial Warehouse",
    totalBudget: 850000,
    spent: 720000,
    remaining: 130000,
    categories: [
      { name: "Materials", budgeted: 340000, spent: 288000 },
      { name: "Labor", budgeted: 255000, spent: 216000 },
      { name: "Equipment", budgeted: 170000, spent: 144000 },
      { name: "Other", budgeted: 85000, spent: 72000 }
    ]
  }
];

const Budget = () => {
  const getSpentPercentage = (spent: number, budget: number) => {
    return Math.round((spent / budget) * 100);
  };

  const getVarianceColor = (spent: number, budgeted: number) => {
    const percentage = (spent / budgeted) * 100;
    if (percentage > 95) return "text-destructive";
    if (percentage > 80) return "text-warning";
    return "text-success";
  };

  const getVarianceIcon = (spent: number, budgeted: number) => {
    const percentage = (spent / budgeted) * 100;
    if (percentage > 100) return <TrendingUp className="h-4 w-4 text-destructive" />;
    if (percentage > 95) return <AlertTriangle className="h-4 w-4 text-warning" />;
    return <TrendingDown className="h-4 w-4 text-success" />;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Budget</h1>
              <p className="text-muted-foreground">Monitor project costs and financial performance</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Export Report</Button>
              <Button>Add Expense</Button>
            </div>
          </div>

          <div className="grid gap-6">
            {budgetData.map((project) => (
              <Card key={project.id} className="shadow-soft hover:shadow-medium transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    {project.project}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Budget</span>
                        <span className="font-semibold">${project.totalBudget.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Spent</span>
                        <span className="font-semibold">${project.spent.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Remaining</span>
                        <span className={`font-semibold ${project.remaining < project.totalBudget * 0.1 ? 'text-destructive' : 'text-success'}`}>
                          ${project.remaining.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Budget Used</span>
                        <span className="font-semibold">{getSpentPercentage(project.spent, project.totalBudget)}%</span>
                      </div>
                      <Progress 
                        value={getSpentPercentage(project.spent, project.totalBudget)} 
                        className="h-3"
                      />
                      {project.remaining < project.totalBudget * 0.1 && (
                        <div className="flex items-center gap-1 text-sm text-destructive">
                          <AlertTriangle className="h-4 w-4" />
                          <span>Budget running low</span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end">
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground">Budget Breakdown</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {project.categories.map((category, index) => (
                        <Card key={index} className="border border-border/50">
                          <CardContent className="p-4">
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">{category.name}</span>
                                {getVarianceIcon(category.spent, category.budgeted)}
                              </div>
                              
                              <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span className="text-muted-foreground">Budgeted</span>
                                  <span>${category.budgeted.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                  <span className="text-muted-foreground">Spent</span>
                                  <span className={getVarianceColor(category.spent, category.budgeted)}>
                                    ${category.spent.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span className="text-muted-foreground">Used</span>
                                  <span className="font-medium">
                                    {getSpentPercentage(category.spent, category.budgeted)}%
                                  </span>
                                </div>
                                <Progress 
                                  value={getSpentPercentage(category.spent, category.budgeted)} 
                                  className="h-2"
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
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

export default Budget;