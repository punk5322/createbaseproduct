import { QueryClientProvider } from "@tanstack/react-query";
import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from "@/components/ui/sidebar";

import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import HomePage from "@/pages/home-page";
import LandingPage from "@/pages/landing";
import AddSongPage from "@/pages/add-song";
import OnboardingPage from "@/pages/onboarding";
import KYCPage from "@/pages/kyc";
import PaymentPage from "@/pages/payment";
import HowItWorksPage from "@/pages/how-it-works";
import EULAPage from "@/pages/eula";
import ReportingPage from "@/pages/reporting";
import SettingsPage from "@/pages/settings";
import PaymentsPage from "@/pages/payments";
import SplitsPage from "@/pages/splits";

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}

// Wrapper for pages that need the main layout with proper path handling
function ProtectedPageLayout({ page: Page }: { page: React.ComponentType }) {
  return (
    <MainLayout>
      <Page />
    </MainLayout>
  );
}

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/auth" component={AuthPage} />

      {/* Onboarding flow routes */}
      <ProtectedRoute path="/onboarding" component={OnboardingPage} />
      <ProtectedRoute path="/how-it-works" component={HowItWorksPage} />
      <ProtectedRoute path="/payment" component={PaymentPage} />
      <ProtectedRoute path="/eula" component={EULAPage} />
      <ProtectedRoute path="/kyc" component={KYCPage} />

      {/* Main app routes with layout */}
      <Route path="/dashboard">
        <ProtectedRoute component={() => <ProtectedPageLayout page={HomePage} />} />
      </Route>

      <Route path="/reporting">
        <ProtectedRoute component={() => <ProtectedPageLayout page={ReportingPage} />} />
      </Route>

      <Route path="/settings">
        <ProtectedRoute component={() => <ProtectedPageLayout page={SettingsPage} />} />
      </Route>

      <Route path="/payments">
        <ProtectedRoute component={() => <ProtectedPageLayout page={PaymentsPage} />} />
      </Route>

      <Route path="/splits">
        <ProtectedRoute component={() => <ProtectedPageLayout page={SplitsPage} />} />
      </Route>

      <Route path="/">
        <Redirect to="/dashboard" />
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;