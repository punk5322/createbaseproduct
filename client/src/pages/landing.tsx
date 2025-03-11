import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";
import { Search, ChartBar } from "lucide-react";

export default function LandingPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  if (!user) {
    setLocation("/auth");
    return null;
  }

  // Don't show landing page for new users or incomplete onboarding
  if (user.isNewUser || user.paymentStatus === "pending" || user.kycStatus === "pending") {
    setLocation("/how-it-works");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">
            Welcome back, {user.artistName}
          </h1>
          <div className="grid md:grid-cols-2 gap-6">
            <Card 
              className="hover:bg-accent/50 cursor-pointer transition-colors"
              onClick={() => setLocation("/splits")}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Find My Royalties
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Search global music databases to recover unpaid royalties and manage splits
                </p>
              </CardContent>
            </Card>
            <Card 
              className="hover:bg-accent/50 cursor-pointer transition-colors"
              onClick={() => setLocation("/dashboard")}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChartBar className="h-5 w-5" />
                  Go to Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  View your earnings, manage your catalog, and track performance
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}