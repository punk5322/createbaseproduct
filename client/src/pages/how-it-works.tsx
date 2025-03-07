import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, CreditCard, Database } from "lucide-react";
import { Header } from "@/components/ui/header";

export default function HowItWorksPage() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  if (!user) {
    setLocation("/auth");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl">How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">
                CreateBase acts as your personal royalty accountant and detective.
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Retrieve Missing Royalties</h4>
                  <p className="text-muted-foreground">
                    We search global music databases to recover unpaid royalties stuck in the "black box"
                    due to mismatched or incomplete metadata.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Prepare Your Catalog for Licensing</h4>
                  <p className="text-muted-foreground">
                    Our team verifies your song data- titles, splits, credits, and more- to ensure it's accurate
                    and complete. We fix issues like missing shares or misaligned splits, so your songs are
                    ready for licensing opportunities in TV, film and commercials.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">
                Planning Made Simple
              </h2>
              <div className="space-y-4">
                <h3 className="text-xl">
                  We charge a one-time setup fee of $20. Here's what it covers:
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Identity Verification</h4>
                    <p className="text-muted-foreground">
                      Prove ownership across all your artist names.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Royalty Recovery</h4>
                    <p className="text-muted-foreground">
                      A global search for unpaid royalties related to a single artist catalog. We keep
                      15% of anything we find, and pass 85% through to you.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Ongoing Royalty Collection</h4>
                    <p className="text-muted-foreground">
                      Administration of rights for unlimited songs and artist names. You keep 85% of
                      what we recover; we retain 15% to cover our work. This fee supports identity
                      verification, computing costs, and our customer support team. In the future,
                      we're working to provide additional free searches.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setLocation("/auth")}
              >
                Back
              </Button>
              <Button 
                className="flex-1"
                onClick={() => setLocation("/payment")}
              >
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}