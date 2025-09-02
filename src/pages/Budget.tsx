import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle, Brain } from "lucide-react";
import AICostOptimizer from "@/components/ai/AICostOptimizer";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import ExpenseForm from "@/components/forms/ExpenseForm";
import { useProject } from "@/contexts/ProjectContext";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  const { selectedProject } = useProject();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedProject) {
      loadExpenses();
    }
  }, [selectedProject]);

  const loadExpenses = async () => {
    if (!selectedProject) return;

    setLoading(true);
    try {
      // Load expenses, task costs, and material costs
      const [expensesResult, tasksResult, materialsResult] = await Promise.all([
        supabase
          .from('expenses')
          .select('*')
          .eq('project_id', selectedProject.id)
          .order('expense_date', { ascending: false }),
        supabase
          .from('tasks')
          .select('id, title, cost, due_date, status')
          .eq('project_id', selectedProject.id)
          .not('cost', 'is', null),
        supabase
          .from('materials')
          .select('id, name, quantity, unit_cost, delivered_at, supplier')
          .eq('project_id', selectedProject.id)
      ]);

      if (expensesResult.error) throw expensesResult.error;
      if (tasksResult.error) throw tasksResult.error;
      if (materialsResult.error) throw materialsResult.error;

      const baseExpenses = expensesResult.data || [];

      // Task costs as expenses
      const taskExpenses = (tasksResult.data || []).map(task => ({
        id: `task-${task.id}`,
        category: 'Task Cost',
        description: task.title,
        amount: Number(task.cost) || 0,
        expense_date: task.due_date || new Date().toISOString().split('T')[0],
        isTask: true
      }));

      // Material costs as expenses (quantity * unit_cost)
      const materialExpenses = (materialsResult.data || []).map((m) => ({
        id: `material-${m.id}`,
        category: 'Materials',
        description: `${m.name}${m.unit_cost ? ` @ ${m.unit_cost} per unit` : ''}`,
        amount: m.unit_cost ? Number(m.unit_cost) * Number(m.quantity || 0) : 0,
        expense_date: m.delivered_at || new Date().toISOString().split('T')[0],
        isMaterial: true
      }));

      setExpenses([...baseExpenses, ...taskExpenses, ...materialExpenses]);
    } catch (error) {
      console.error('Error loading expenses:', error);
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  const totalSpent = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
  const budgetUtilization = selectedProject?.budget 
    ? Math.round((totalSpent / selectedProject.budget) * 100)
    : 0;
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

          {!selectedProject ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Please select a project to view budget details</p>
            </div>
          ) : (
            <>
              {/* Budget Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card className="shadow-soft">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Budget</p>
                        <p className="text-2xl font-bold">
                          {selectedProject.budget ? `${selectedProject.budget.toLocaleString()} MAD` : 'Not set'}
                        </p>
                      </div>
                      <DollarSign className="h-8 w-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-soft">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Spent</p>
                        <p className="text-2xl font-bold">{totalSpent.toLocaleString()} MAD</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-accent" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-soft">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Utilization</p>
                        <p className="text-2xl font-bold">{budgetUtilization}%</p>
                      </div>
                      <AlertTriangle className={`h-8 w-8 ${budgetUtilization > 80 ? 'text-destructive' : 'text-success'}`} />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {selectedProject.budget && (
                <Card className="shadow-soft mb-6">
                  <CardHeader>
                    <CardTitle>Budget Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Spent: {totalSpent.toLocaleString()} MAD</span>
                        <span>Remaining: {(selectedProject.budget - totalSpent).toLocaleString()} MAD</span>
                      </div>
                      <Progress value={budgetUtilization} className="h-3" />
                      {budgetUtilization > 90 && (
                        <p className="text-sm text-destructive">⚠️ Budget utilization is very high</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* AI Cost Optimizer */}
              <Card className="shadow-soft mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    AI Cost Optimizer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AICostOptimizer />
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Expense Form */}
                <ExpenseForm />

                {/* Recent Expenses */}
                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle>Recent Expenses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <p className="text-muted-foreground text-center py-4">Loading expenses...</p>
                    ) : expenses.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">No expenses recorded yet</p>
                    ) : (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {expenses.slice(0, 10).map((expense) => (
                          <div key={expense.id} className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                            <div>
                              <p className="font-medium">{expense.category}</p>
                              <p className="text-sm text-muted-foreground">{expense.description}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(expense.expense_date).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">{expense.amount.toLocaleString()} MAD</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Budget;
