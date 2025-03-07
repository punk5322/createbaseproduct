import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Song } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SongTable from "@/components/song-table";
import { Loader2, LogOut } from "lucide-react";
import AddSongSheet from "@/components/add-song-sheet";

// Mock data for initial catalog
const INITIAL_SONGS: Song[] = [
  {
    id: 1,
    userId: 1,
    title: "Rich Flex",
    artist: "Drake & 21 Savage",
    status: "claimed",
    splitData: {
      music: [
        { name: "Drake", percentage: 50 },
        { name: "21 Savage", percentage: 50 }
      ],
      lyrics: [
        { name: "Drake", percentage: 50 },
        { name: "21 Savage", percentage: 50 }
      ],
      instruments: [
        { name: "40", percentage: 25 },
        { name: "Tay Keith", percentage: 25 },
        { name: "Vinylz", percentage: 25 },
        { name: "Conductor", percentage: 25 }
      ]
    }
  },
  {
    id: 2,
    userId: 1,
    title: "Jimmy Cooks",
    artist: "Drake ft. 21 Savage",
    status: "claimed",
    splitData: {
      music: [
        { name: "Drake", percentage: 60 },
        { name: "21 Savage", percentage: 40 }
      ],
      lyrics: [
        { name: "Drake", percentage: 60 },
        { name: "21 Savage", percentage: 40 }
      ],
      instruments: [
        { name: "Tay Keith", percentage: 50 },
        { name: "40", percentage: 50 }
      ]
    }
  },
  {
    id: 3,
    userId: 1,
    title: "Money In The Grave",
    artist: "Drake ft. Rick Ross",
    status: "unclaimed",
    splitData: {
      music: [
        { name: "Drake", percentage: 70 },
        { name: "Rick Ross", percentage: 30 }
      ],
      lyrics: [
        { name: "Drake", percentage: 70 },
        { name: "Rick Ross", percentage: 30 }
      ],
      instruments: [
        { name: "40", percentage: 40 },
        { name: "Cardo", percentage: 40 },
        { name: "Engineer", percentage: 20 }
      ]
    }
  },
  {
    id: 4,
    userId: 1,
    title: "Privileged Rappers",
    artist: "Drake ft. 21 Savage",
    status: "unclaimed",
    splitData: {
      music: [
        { name: "Drake", percentage: 50 },
        { name: "21 Savage", percentage: 50 }
      ],
      lyrics: [
        { name: "Drake", percentage: 50 },
        { name: "21 Savage", percentage: 50 }
      ],
      instruments: [
        { name: "Audio Engineer 1", percentage: 25 },
        { name: "Audio Engineer 2", percentage: 25 },
        { name: "Producer 1", percentage: 25 },
        { name: "Producer 2", percentage: 25 }
      ]
    }
  }
];

export default function HomePage() {
  const { user, logoutMutation } = useAuth();
  const [, setLocation] = useLocation();

  const {
    data: songs = INITIAL_SONGS,
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
            <AddSongSheet />
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
              <p className="text-3xl font-bold">$42,150.00</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Claim Status</CardTitle>
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