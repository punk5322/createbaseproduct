import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Song } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SongTable from "@/components/song-table";
import { Loader2, LogOut } from "lucide-react";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();
  const [, setLocation] = useLocation();

  const {
    data: songs,
    isLoading,
    error,
  } = useQuery<Song[]>({
    queryKey: ["/api/songs"],
  });

  useEffect(() => {
    if (user) {
      // First check payment status
      if (user.paymentStatus === "pending") {
        setLocation("/onboarding");
      }
      // Only check KYC if payment is completed
      else if (user.paymentStatus === "completed" && user.kycStatus === "pending") {
        setLocation("/kyc");
      }
    }
  }, [user, setLocation]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Error loading songs: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {user?.artistName}</h1>
            <p className="text-muted-foreground">
              Manage your music catalog and royalties
            </p>
          </div>
          <div className="flex gap-4">
            <Button onClick={() => setLocation("/onboarding")}>Add Songs</Button>
            <Button 
              variant="outline" 
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Songs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{songs?.length || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Pending Royalties</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">$0.00</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold capitalize">{user?.kycStatus}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Song Catalog</CardTitle>
          </CardHeader>
          <CardContent>
            <SongTable songs={songs || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}