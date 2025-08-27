import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Projects from "./pages/Projects";
import Schedule from "./pages/Schedule";
import Tasks from "./pages/Tasks";
import DailyLogs from "./pages/DailyLogs";
import Timesheets from "./pages/Timesheets";
import Materials from "./pages/Materials";
import Equipment from "./pages/Equipment";
import RFIs from "./pages/RFIs";
import Photos from "./pages/Photos";
import Budget from "./pages/Budget";
import Reports from "./pages/Reports";
import Quality from "./pages/Quality";
import Documents from "./pages/Documents";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
          <Route path="/timesheets" element={<Timesheets />} />
          <Route path="/materials" element={<Materials />} />
          <Route path="/equipment" element={<Equipment />} />
          <Route path="/rfis" element={<RFIs />} />
          <Route path="/photos" element={<Photos />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/quality" element={<Quality />} />
          <Route path="/documents" element={<Documents />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
