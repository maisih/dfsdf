import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { ProjectProvider } from "@/contexts/ProjectContext";
import { InvitationAuthProvider } from "@/contexts/InvitationAuthContext";
import { ProtectedRoute, RoleProtectedRoute } from "@/components/layout/ProtectedRoute";
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
const Auth = lazy(() => import("./pages/Auth"));
const InvitationManagement = lazy(() => import("./pages/InvitationManagement"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  useEffect(() => {
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading…</div>}>
      <div key={location.pathname} className="route-enter">
        <Routes location={location}>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<RoleProtectedRoute allowedRoles={["engineer","visitor"]} redirectTo="/reports"><Index /></RoleProtectedRoute>} />
          <Route path="/projects" element={<RoleProtectedRoute allowedRoles={["engineer","visitor"]} redirectTo="/reports"><Projects /></RoleProtectedRoute>} />
          <Route path="/schedule" element={<RoleProtectedRoute allowedRoles={["engineer","visitor"]} redirectTo="/reports"><Schedule /></RoleProtectedRoute>} />
          <Route path="/tasks" element={<RoleProtectedRoute allowedRoles={["engineer","visitor"]} redirectTo="/reports"><Tasks /></RoleProtectedRoute>} />
          <Route path="/team" element={<RoleProtectedRoute allowedRoles={["engineer","visitor"]} redirectTo="/reports"><Team /></RoleProtectedRoute>} />
          <Route path="/materials" element={<RoleProtectedRoute allowedRoles={["engineer","visitor"]} redirectTo="/reports"><Materials /></RoleProtectedRoute>} />
          <Route path="/equipment" element={<RoleProtectedRoute allowedRoles={["engineer","visitor"]} redirectTo="/reports"><Equipment /></RoleProtectedRoute>} />
          <Route path="/budget" element={<RoleProtectedRoute allowedRoles={["engineer","visitor"]} redirectTo="/reports"><Budget /></RoleProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/documents" element={<RoleProtectedRoute allowedRoles={["engineer","visitor"]} redirectTo="/reports"><Documents /></RoleProtectedRoute>} />
          <Route path="/admin" element={<RoleProtectedRoute allowedRoles={["admin","engineer"]}><InvitationManagement /></RoleProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
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
