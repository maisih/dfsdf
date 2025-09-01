import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProjectProvider } from "@/contexts/ProjectContext";
import AIAssistantBubble from "@/components/ai/AIAssistantBubble";
import Index from "./pages/Index";
import Projects from "./pages/Projects";
import Schedule from "./pages/Schedule";
import Tasks from "./pages/Tasks";
import DailyLogs from "./pages/DailyLogs";
import Team from "./pages/Team";
import Materials from "./pages/Materials";
import Equipment from "./pages/Equipment";
import Budget from "./pages/Budget";
import Reports from "./pages/Reports";
import Documents from "./pages/Documents";
import AI from "./pages/AI";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ProjectProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/logs" element={<DailyLogs />} />
            <Route path="/team" element={<Team />} />
            <Route path="/materials" element={<Materials />} />
            <Route path="/equipment" element={<Equipment />} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/ai" element={<AI />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <AIAssistantBubble />
        </BrowserRouter>
      </TooltipProvider>
    </ProjectProvider>
  </QueryClientProvider>
);

export default App;
