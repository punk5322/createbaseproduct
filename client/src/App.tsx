import { QueryClientProvider } from "@tanstack/react-query";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import { Toaster } from "@/components/ui/toaster";

import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import HomePage from "@/pages/home-page";
import OnboardingPage from "@/pages/onboarding";
import KYCPage from "@/pages/kyc";
import PaymentPage from "@/pages/payment";
import HowItWorksPage from "@/pages/how-it-works";
import EULAPage from "@/pages/eula";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/" component={HomePage} />
      <ProtectedRoute path="/how-it-works" component={HowItWorksPage} />
      <ProtectedRoute path="/payment" component={PaymentPage} />
      <ProtectedRoute path="/eula" component={EULAPage} />
      <ProtectedRoute path="/kyc" component={KYCPage} />
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