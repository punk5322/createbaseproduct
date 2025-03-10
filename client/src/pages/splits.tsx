import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CreateSplitFlow from "@/components/create-split-flow";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface Split {
  id: number;
  songTitle: string;
  artist: string;
  collaborators: {
    name: string;
    role: string;
    share: number;
  }[];
  totalShare: number;
  status: string;
}

export default function SplitsPage() {
  const [createSplitOpen, setCreateSplitOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterArtist, setFilterArtist] = useState<string>("all");
  const [sortBy, setSortBy] = useState("songTitle");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: splits = [] } = useQuery<Split[]>({
    queryKey: ["/api/splits"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/splits");
      return response.json();
    },
  });

  // Get unique artists from splits for filter dropdown
  const uniqueArtists = Array.from(
    new Set(
      splits.flatMap((split) => [
        split.artist,
        ...split.collaborators.map((c) => c.name),
      ])
    )
  );

  const filteredSplits = splits
    .filter(
      (split) =>
        (split.songTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          split.artist.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (filterArtist === "all" ||
          split.artist === filterArtist ||
          split.collaborators.some((c) => c.name === filterArtist))
    )
    .sort((a, b) => {
      if (sortBy === "songTitle") return a.songTitle.localeCompare(b.songTitle);
      if (sortBy === "artist") return a.artist.localeCompare(b.artist);
      return a.status.localeCompare(b.status);
    });

  const handleCreateSplit = async (data: any) => {
    try {
      await apiRequest("POST", "/api/splits", {
        songTitle: data.mainArtist.songTitle,
        artist: data.mainArtist.artistName,
        collaborators: [
          {
            name: data.mainArtist.artistName,
            role: "Artist/Writer",
            share: data.mainArtist.split,
          },
          ...data.collaborators.map((c: any) => ({
            name: c.artistName,
            role: "Artist/Writer",
            share: c.split,
          })),
        ],
        status: "Active",
      });

      queryClient.invalidateQueries({ queryKey: ["/api/splits"] });
      toast({
        title: "Split Created",
        description: "New split has been created successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Splits Management</h1>
        <Button onClick={() => setCreateSplitOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Split
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Splits</CardTitle>
          <div className="flex gap-4 mt-4">
            <div className="flex-1">
              <Input
                placeholder="Search by song or artist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={filterArtist} onValueChange={setFilterArtist}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by artist" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Artists</SelectItem>
                {uniqueArtists.map((artist) => (
                  <SelectItem key={artist} value={artist}>
                    {artist}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="songTitle">Sort by Song</SelectItem>
                <SelectItem value="artist">Sort by Artist</SelectItem>
                <SelectItem value="status">Sort by Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Song Title</TableHead>
                <TableHead>Artist</TableHead>
                <TableHead>Contributors</TableHead>
                <TableHead>Total Share</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSplits.map((split) => (
                <TableRow key={split.id}>
                  <TableCell>{split.songTitle}</TableCell>
                  <TableCell>{split.artist}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {split.collaborators.map((c, i) => (
                        <div key={i} className="text-sm">
                          {c.name} ({c.share}%)
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{split.totalShare}%</TableCell>
                  <TableCell>{split.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CreateSplitFlow
        open={createSplitOpen}
        onOpenChange={setCreateSplitOpen}
        onComplete={handleCreateSplit}
      />
    </div>
  );
}