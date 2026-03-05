import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthGuard from "@/components/AuthGuard";
import AppSidebar from "@/components/layout/AppSidebar";
import Login from "./pages/Login";
import Index from "./pages/Index";
import IntelligenceRadar from "./pages/IntelligenceRadar";
import CompetitorDeepDive from "./pages/CompetitorDeepDive";
import LocalizationEngine from "./pages/LocalizationEngine";
import RiskScanner from "./pages/RiskScanner";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route
            path="/*"
            element={
              <AuthGuard>
                <div className="flex min-h-screen">
                  <AppSidebar />
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/intelligence-radar" element={<IntelligenceRadar />} />
                    <Route path="/competitor/:id" element={<CompetitorDeepDive />} />
                    <Route path="/localization-engine" element={<LocalizationEngine />} />
                    <Route path="/risk-scanner" element={<RiskScanner />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </AuthGuard>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
