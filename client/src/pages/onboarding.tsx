import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Song } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const DEMO_SONGS = [
  { id: 1, title: "Money In The Grave", artist: "Drake ft. Rick Ross" },
  { id: 2, title: "Champagne Poetry", artist: "Drake" },
  { id: 3, title: "Fair Trade", artist: "Drake ft. Travis Scott" },
  // Add more demo songs as needed
];

export default function OnboardingPage() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedSongs, setSelectedSongs] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (user?.paymentStatus === "completed") {
      setLocation("/");
    }
  }, [user, setLocation]);

  const handlePayment = async () => {
    if (selectedSongs.length === 0) {
      toast({
        title: "No songs selected",
        description: "Please select at least one song to continue",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      await apiRequest("POST", "/api/payment", {});
      toast({
        title: "Payment Successful",
        description: "You can now proceed with KYC verification",
      });
      setLocation("/kyc");
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Select Your Songs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {DEMO_SONGS.map((song) => (
                <div
                  key={song.id}
                  className="flex items-center space-x-4 p-4 border rounded-lg"
                >
                  <Checkbox
                    id={`song-${song.id}`}
                    checked={selectedSongs.includes(song.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedSongs([...selectedSongs, song.id]);
                      } else {
                        setSelectedSongs(
                          selectedSongs.filter((id) => id !== song.id)
                        );
                      }
                    }}
                  />
                  <div>
                    <p className="font-medium">{song.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {song.artist}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {selectedSongs.length > 0 && (
              <div className="mt-6 space-y-4">
                <div className="p-4 border rounded-lg">
                  <p className="font-medium">Payment Summary</p>
                  <p className="text-sm text-muted-foreground">
                    One-time registration fee: $20.00
                  </p>
                </div>
                <Button
                  onClick={handlePayment}
                  className="w-full"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Pay $20.00"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}