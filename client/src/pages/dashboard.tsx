import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, Upload, CreditCard, Library } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Song } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const SONGS_PER_TIER = 200;
const TIER_PRICE = 10;

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch songs to get the count
  const { data: songs = [] } = useQuery<Song[]>({
    queryKey: ["/api/songs"],
  });

  const currentTier = Math.floor(songs.length / SONGS_PER_TIER);
  const songsRemaining = SONGS_PER_TIER - (songs.length % SONGS_PER_TIER);
  const paidTier = user?.songTier || 0;

  const handleUpgradeTier = async () => {
    try {
      await apiRequest("POST", "/api/payment/upgrade-tier", {});
      toast({
        title: "Tier Upgraded",
        description: "You can now add more songs to your catalog",
      });
    } catch (error: any) {
      toast({
        title: "Upgrade Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const steps = [
    {
      title: "Complete KYC",
      description: "Upload your identification documents",
      icon: Upload,
      link: "/kyc",
      complete: user?.kycStatus === "completed"
    },
    {
      title: "Make Payment",
      description: "One-time platform fee of $20",
      icon: CreditCard,
      link: "/payment",
      complete: user?.paymentStatus === "completed"
    },
    {
      title: "Manage Catalog",
      description: "View and manage your song catalog",
      icon: Library,
      link: "/catalog",
      complete: user?.kycStatus === "completed" && user?.paymentStatus === "completed"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user?.artistName}</h1>
          <p className="text-muted-foreground">{user?.songwriterName}</p>
        </div>
        <Music className="h-8 w-8 text-primary" />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {steps.map((step) => (
          <Card key={step.title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <step.icon className="h-5 w-5" />
                {step.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{step.description}</p>
              <Button
                asChild
                variant={step.complete ? "outline" : "default"}
                className="w-full"
                disabled={!step.complete && step.title === "Manage Catalog"}
              >
                <Link href={step.link}>
                  {step.complete ? "View" : "Complete"}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {songs.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Song Catalog Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>Total Songs: {songs.length}</p>
              <p>Songs Remaining in Current Tier: {songsRemaining}</p>
              {currentTier > paidTier && (
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">
                    You've reached your song limit. Upgrade your tier to add more songs.
                  </p>
                  <Button onClick={handleUpgradeTier}>
                    Upgrade for ${TIER_PRICE}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}