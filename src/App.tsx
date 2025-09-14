import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProjectProvider } from "@/contexts/ProjectContext";
import { InvitationAuthProvider } from "@/contexts/InvitationAuthContext";
import { SecureAuthProvider } from "@/contexts/SecureAuthContext";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
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
import Auth from "./pages/Auth";
import InvitationManagement from "./pages/InvitationManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SecureAuthProvider>
      <ProjectProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
              <Route path="/schedule" element={<ProtectedRoute><Schedule /></ProtectedRoute>} />
              <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
              <Route path="/logs" element={<ProtectedRoute><DailyLogs /></ProtectedRoute>} />
              <Route path="/team" element={<ProtectedRoute><Team /></ProtectedRoute>} />
              <Route path="/materials" element={<ProtectedRoute><Materials /></ProtectedRoute>} />
              <Route path="/equipment" element={<ProtectedRoute><Equipment /></ProtectedRoute>} />
              <Route path="/budget" element={<ProtectedRoute><Budget /></ProtectedRoute>} />
              <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
              <Route path="/documents" element={<ProtectedRoute><Documents /></ProtectedRoute>} />
              <Route path="/ai" element={<ProtectedRoute><AI /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute><InvitationManagement /></ProtectedRoute>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <ProtectedRoute>
              <AIAssistantBubble />
            </ProtectedRoute>
          </BrowserRouter>
        </TooltipProvider>
      </ProjectProvider>
    </SecureAuthProvider>
  </QueryClientProvider>
);

export default App;
