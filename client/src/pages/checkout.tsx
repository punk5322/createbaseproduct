import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header";
import { Loader2, Receipt } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Song } from "@shared/schema";

export default function CheckoutPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedSongIds, setSelectedSongIds] = useState<number[]>([]);

  // Parse selected song IDs from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const songIds = params.get("songs")?.split(",").map(Number) || [];
    setSelectedSongIds(songIds);
  }, []);

  // Fetch selected songs
  const { data: songs = [] } = useQuery<Song[]>({
    queryKey: ["/api/songs"],
    select: (data) => data.filter((song) => selectedSongIds.includes(song.id)),
  });

  const setupFeeRequired = user?.paymentStatus !== "completed";
  const setupFee = setupFeeRequired ? 20 : 0;
  const commissionRate = 0.15; // 15% commission

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      if (setupFeeRequired) {
        await apiRequest("POST", "/api/payment", {});
        queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      }

      // Save selected songs
      await apiRequest("POST", "/api/save-selected-songs", {
        songs: selectedSongIds,
      });

      toast({
        title: "Success",
        description: "Your royalty claim has been processed",
      });
      setLocation("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Checkout Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Selected Songs</h3>
                <div className="space-y-2">
                  {songs.map((song) => (
                    <div
                      key={song.id}
                      className="flex justify-between items-center p-3 bg-muted rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{song.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {song.artist}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          song.status === "claimed"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {song.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-4">Fee Summary</h3>
                <div className="space-y-2">
                  {setupFeeRequired && (
                    <div className="flex justify-between">
                      <span>One-time Setup Fee</span>
                      <span className="font-medium">${setupFee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-muted-foreground">
                    <span>Commission on Found Royalties</span>
                    <span>{(commissionRate * 100).toFixed(0)}%</span>
                  </div>
                  {setupFeeRequired && (
                    <div className="flex justify-between pt-2 border-t font-medium">
                      <span>Total Due Now</span>
                      <span>${setupFee.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setLocation("/catalog")}
                >
                  Back
                </Button>
                <Button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Complete Checkout"
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
