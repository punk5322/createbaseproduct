import { Switch, Route, useLocation, Redirect } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
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

function ProtectedMainLayout({ component: Component }: { component: React.ComponentType }) {
  return (
    <MainLayout>
      <Component />
    </MainLayout>
  );
}

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/auth" component={AuthPage} />

      {/* Landing and story flow */}
      <Route path="/">
        <ProtectedRoute component={LandingPage} />
      </Route>
      <Route path="/add-song">
        <ProtectedRoute component={() => <ProtectedMainLayout component={AddSongPage} />} />
      </Route>

      {/* Onboarding flow routes */}
      <ProtectedRoute path="/onboarding" component={OnboardingPage} />
      <ProtectedRoute path="/how-it-works" component={HowItWorksPage} />
      <ProtectedRoute path="/payment" component={PaymentPage} />
      <ProtectedRoute path="/eula" component={EULAPage} />
      <ProtectedRoute path="/kyc" component={KYCPage} />

      {/* Main app routes */}
      <Route path="/dashboard">
        <ProtectedRoute component={() => <ProtectedMainLayout component={HomePage} />} />
      </Route>
      <Route path="/reporting">
        <ProtectedRoute component={() => <ProtectedMainLayout component={ReportingPage} />} />
      </Route>
      <Route path="/settings">
        <ProtectedRoute component={() => <ProtectedMainLayout component={SettingsPage} />} />
      </Route>
      <Route path="/payments">
        <ProtectedRoute component={() => <ProtectedMainLayout component={PaymentsPage} />} />
      </Route>
      <Route path="/splits">
        <ProtectedRoute component={() => <ProtectedMainLayout component={SplitsPage} />} />
      </Route>

      <Route>
        <NotFound />
      </Route>
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