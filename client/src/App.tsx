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

// Wrapper for pages that need the main layout
function ProtectedPageWithLayout({ component: Component }: { component: React.ComponentType }) {
  return (
    <MainLayout>
      <Component />
    </MainLayout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/onboarding" component={OnboardingPage} />
      <ProtectedRoute path="/how-it-works" component={HowItWorksPage} />
      <ProtectedRoute path="/payment" component={PaymentPage} />
      <ProtectedRoute path="/eula" component={EULAPage} />
      <ProtectedRoute path="/kyc" component={KYCPage} />

      {/* Protected routes with MainLayout */}
      <ProtectedRoute 
        path="/dashboard" 
        component={() => <ProtectedPageWithLayout component={HomePage} />} 
      />
      <ProtectedRoute 
        path="/reporting" 
        component={() => <ProtectedPageWithLayout component={ReportingPage} />} 
      />
      <ProtectedRoute 
        path="/settings" 
        component={() => <ProtectedPageWithLayout component={SettingsPage} />} 
      />
      <ProtectedRoute 
        path="/payments" 
        component={() => <ProtectedPageWithLayout component={PaymentsPage} />} 
      />
      <ProtectedRoute 
        path="/splits" 
        component={() => <ProtectedPageWithLayout component={SplitsPage} />} 
      />

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