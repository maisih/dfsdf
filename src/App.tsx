import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ProjectProvider } from "@/contexts/ProjectContext";
import { InvitationAuthProvider } from "@/contexts/InvitationAuthContext";
import { ProtectedRoute, RoleProtectedRoute } from "@/components/layout/ProtectedRoute";
import AIAssistantBubble from "@/components/ai/AIAssistantBubble";
const Index = lazy(() => import("./pages/Index"));
const Projects = lazy(() => import("./pages/Projects"));
const Schedule = lazy(() => import("./pages/Schedule"));
const Tasks = lazy(() => import("./pages/Tasks"));
const Team = lazy(() => import("./pages/Team"));
const Materials = lazy(() => import("./pages/Materials"));
const Equipment = lazy(() => import("./pages/Equipment"));
const Budget = lazy(() => import("./pages/Budget"));
const Reports = lazy(() => import("./pages/Reports"));
const Documents = lazy(() => import("./pages/Documents"));
const AI = lazy(() => import("./pages/AI"));
const Auth = lazy(() => import("./pages/Auth"));
const InvitationManagement = lazy(() => import("./pages/InvitationManagement"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading…</div>}>
      <div key={location.pathname} className="route-enter">
        <Routes location={location}>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
          <Route path="/schedule" element={<ProtectedRoute><Schedule /></ProtectedRoute>} />
          <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
          <Route path="/team" element={<ProtectedRoute><Team /></ProtectedRoute>} />
          <Route path="/materials" element={<ProtectedRoute><Materials /></ProtectedRoute>} />
          <Route path="/equipment" element={<ProtectedRoute><Equipment /></ProtectedRoute>} />
          <Route path="/budget" element={<ProtectedRoute><Budget /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/documents" element={<ProtectedRoute><Documents /></ProtectedRoute>} />
          <Route path="/ai" element={<ProtectedRoute><AI /></ProtectedRoute>} />
          <Route path="/admin" element={<RoleProtectedRoute allowedRoles={["admin"]}><InvitationManagement /></RoleProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ProtectedRoute>
          <AIAssistantBubble />
        </ProtectedRoute>
      </div>
    </Suspense>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <InvitationAuthProvider>
      <ProjectProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AnimatedRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </ProjectProvider>
    </InvitationAuthProvider>
  </QueryClientProvider>
);

export default App;
