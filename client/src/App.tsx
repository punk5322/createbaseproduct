import { Switch, Route } from "wouter";
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

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/auth" component={AuthPage} />

      {/* Landing after login */}
      <Route path="/">
        <ProtectedRoute component={LandingPage} />
      </Route>

      {/* Onboarding flow */}
      <Route path="/onboarding">
        <ProtectedRoute component={OnboardingPage} />
      </Route>
      <Route path="/how-it-works">
        <ProtectedRoute component={HowItWorksPage} />
      </Route>
      <Route path="/payment">
        <ProtectedRoute component={PaymentPage} />
      </Route>
      <Route path="/eula">
        <ProtectedRoute component={EULAPage} />
      </Route>
      <Route path="/kyc">
        <ProtectedRoute component={KYCPage} />
      </Route>

      {/* Main app routes with sidebar */}
      <Route path="/dashboard">
        <ProtectedRoute 
          component={() => (
            <MainLayout>
              <HomePage />
            </MainLayout>
          )}
        />
      </Route>
      <Route path="/reporting">
        <ProtectedRoute 
          component={() => (
            <MainLayout>
              <ReportingPage />
            </MainLayout>
          )}
        />
      </Route>
      <Route path="/settings">
        <ProtectedRoute 
          component={() => (
            <MainLayout>
              <SettingsPage />
            </MainLayout>
          )}
        />
      </Route>
      <Route path="/payments">
        <ProtectedRoute 
          component={() => (
            <MainLayout>
              <PaymentsPage />
            </MainLayout>
          )}
        />
      </Route>
      <Route path="/splits">
        <ProtectedRoute 
          component={() => (
            <MainLayout>
              <SplitsPage />
            </MainLayout>
          )}
        />
      </Route>
      <Route path="/add-song">
        <ProtectedRoute 
          component={() => (
            <MainLayout>
              <AddSongPage />
            </MainLayout>
          )}
        />
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