import { useState } from "react";
import { Song } from "@shared/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import SplitVisualization from "./split-visualization";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Edit, Trash } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface SongTableProps {
  songs: Song[];
}

export default function SongTable({ songs }: SongTableProps) {
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const { toast } = useToast();

  const deleteMutation = useMutation({
    mutationFn: async (songId: number) => {
      await apiRequest("DELETE", `/api/songs/${songId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/songs"] });
      toast({
        title: "Song deleted",
        description: "The song has been removed from your catalog",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const calculateTotalSplits = (song: Song) => {
    const splits = song.splitData;
    return (
      splits?.music.length +
      splits?.lyrics.length +
      splits?.instruments.length || 0
    );
  };

  const calculateSplitPercentage = (song: Song) => {
    const splits = song.splitData;
    if (!splits) return "0%";

    const totalPercentage =
      splits.music.reduce((acc, curr) => acc + curr.percentage, 0) +
      splits.lyrics.reduce((acc, curr) => acc + curr.percentage, 0) +
      splits.instruments.reduce((acc, curr) => acc + curr.percentage, 0);

    return `${(totalPercentage / 3).toFixed(1)}%`;
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Artist</TableHead>
            <TableHead>Split %</TableHead>
            <TableHead>Total Splits</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {songs.map((song) => (
            <TableRow key={song.id}>
              <TableCell className="font-medium">{song.title}</TableCell>
              <TableCell>{song.artist}</TableCell>
              <TableCell>{calculateSplitPercentage(song)}</TableCell>
              <TableCell>{calculateTotalSplits(song)}</TableCell>
              <TableCell className="capitalize">{song.status}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setSelectedSong(song)}>
                      <Edit className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => deleteMutation.mutate(song.id)}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Sheet open={!!selectedSong} onOpenChange={() => setSelectedSong(null)}>
        <SheetContent className="w-full sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>{selectedSong?.title}</SheetTitle>
          </SheetHeader>
          {selectedSong && (
            <div className="mt-6 space-y-6">
              <div>
                <h3 className="font-medium mb-2">Song Information</h3>
                <p>Artist: {selectedSong.artist}</p>
                <p className="capitalize">Status: {selectedSong.status}</p>
              </div>

              <div>
                <h3 className="font-medium mb-4">Split Distribution</h3>
                <SplitVisualization splitData={selectedSong.splitData} />
              </div>

              <div className="flex space-x-4">
                <Button variant="secondary" className="flex-1">
                  Edit Splits
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => {
                    if (selectedSong) {
                      deleteMutation.mutate(selectedSong.id);
                      setSelectedSong(null);
                    }
                  }}
                >
                  Delete Song
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
