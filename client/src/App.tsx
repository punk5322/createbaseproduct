import { QueryClientProvider } from "@tanstack/react-query";
import { Switch, Route } from "wouter";
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
  return (
    <Sidebar>
      <SidebarContent>
        <div className="flex flex-col space-y-2 p-2">
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Dashboard">
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Reporting">
              <FileText className="h-4 w-4" />
              <span>Reporting</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Payments">
              <DollarSign className="h-4 w-4" />
              <span>Payments</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Splits">
              <Share2 className="h-4 w-4" />
              <span>Splits</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Settings">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

function Router() {
  return (
    <SidebarProvider>
      <SidebarNav />
      <SidebarInset>
        <Switch>
          <Route path="/auth" component={AuthPage} />
          <ProtectedRoute path="/" component={HomePage} />
          <ProtectedRoute path="/dashboard" component={HomePage} />
          <ProtectedRoute path="/add-song" component={AddSongPage} />
          <ProtectedRoute path="/how-it-works" component={HowItWorksPage} />
          <ProtectedRoute path="/payment" component={PaymentPage} />
          <ProtectedRoute path="/eula" component={EULAPage} />
          <ProtectedRoute path="/kyc" component={KYCPage} />
          <ProtectedRoute path="/reporting" component={ReportingPage} />
          <ProtectedRoute path="/settings" component={SettingsPage} />
          <ProtectedRoute path="/payments" component={PaymentsPage} />
          <ProtectedRoute path="/splits" component={SplitsPage} />
          <Route component={NotFound} />
        </Switch>
      </SidebarInset>
    </SidebarProvider>
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