import { QueryClientProvider } from "@tanstack/react-query";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import { Toaster } from "@/components/ui/toaster";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarInset,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";
import { Settings, FileText, DollarSign, Share2, Home } from "lucide-react";

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

function SidebarNav() {
  const [location, setLocation] = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <div className="flex flex-col pt-2">
          <SidebarMenuItem>
            <SidebarMenuButton 
              tooltip="Dashboard" 
              onClick={() => setLocation("/dashboard")}
              isActive={location === "/dashboard"}
            >
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              tooltip="Reporting" 
              onClick={() => setLocation("/reporting")}
              isActive={location === "/reporting"}
            >
              <FileText className="h-4 w-4" />
              <span>Reporting</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              tooltip="Payments" 
              onClick={() => setLocation("/payments")}
              isActive={location === "/payments"}
            >
              <DollarSign className="h-4 w-4" />
              <span>Payments</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              tooltip="Splits" 
              onClick={() => setLocation("/splits")}
              isActive={location === "/splits"}
            >
              <Share2 className="h-4 w-4" />
              <span>Splits</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              tooltip="Settings" 
              onClick={() => setLocation("/settings")}
              isActive={location === "/settings"}
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

function ProtectedRoutes() {
  return (
    <SidebarProvider>
      <SidebarNav />
      <SidebarInset>
        <Switch>
          <Route path="/dashboard" component={HomePage} />
          <Route path="/add-song" component={AddSongPage} />
          <Route path="/reporting" component={ReportingPage} />
          <Route path="/settings" component={SettingsPage} />
          <Route path="/payments" component={PaymentsPage} />
          <Route path="/splits" component={SplitsPage} />
          <Route path="/">
            <HomePage />
          </Route>
        </Switch>
      </SidebarInset>
    </SidebarProvider>
  );
}

function OnboardingRoutes() {
  return (
    <Switch>
      <Route path="/how-it-works" component={HowItWorksPage} />
      <Route path="/payment" component={PaymentPage} />
      <Route path="/eula" component={EULAPage} />
      <Route path="/kyc" component={KYCPage} />
    </Switch>
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
      <ProtectedRoute path="*" component={ProtectedRoutes} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;