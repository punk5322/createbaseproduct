import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Song } from "@shared/schema";
import CatalogTable from "@/components/catalog-table";
import SongSplitModal from "@/components/song-split-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Library } from "lucide-react";

export default function Catalog() {
  const { user } = useAuth();
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  const { data: songs = [], isLoading } = useQuery<Song[]>({
    queryKey: ["/api/songs"],
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Library className="h-5 w-5" />
            Song Catalog
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CatalogTable
            songs={songs}
            isLoading={isLoading}
            onSongClick={setSelectedSong}
          />
        </CardContent>
      </Card>

      <SongSplitModal
        song={selectedSong}
        onClose={() => setSelectedSong(null)}
      />
    </div>
  );
}
