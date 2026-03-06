import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PageTransition from "./PageTransition";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import IntelligenceRadar from "@/pages/IntelligenceRadar";
import CompetitorDeepDive from "@/pages/CompetitorDeepDive";
import LocalizationEngine from "@/pages/LocalizationEngine";
import RiskScanner from "@/pages/RiskScanner";
import NotFound from "@/pages/NotFound";

export default function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Index />
            </PageTransition>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PageTransition>
              <Dashboard />
            </PageTransition>
          }
        />
        <Route
          path="/intelligence-radar"
          element={
            <PageTransition>
              <IntelligenceRadar />
            </PageTransition>
          }
        />
        <Route
          path="/competitor/:id"
          element={
            <PageTransition>
              <CompetitorDeepDive />
            </PageTransition>
          }
        />
        <Route
          path="/localization-engine"
          element={
            <PageTransition>
              <LocalizationEngine />
            </PageTransition>
          }
        />
        <Route
          path="/risk-scanner"
          element={
            <PageTransition>
              <RiskScanner />
            </PageTransition>
          }
        />
        <Route
          path="*"
          element={
            <PageTransition>
              <NotFound />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}
