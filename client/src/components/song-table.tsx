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
import SplitVisualization from "./split-visualization";

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

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Title</TableHead>
            <TableHead>Artist</TableHead>
            <TableHead>Album/Collection</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {songs.map((song) => (
            <TableRow key={song.id}>
              <TableCell className="font-medium">{song.title}</TableCell>
              <TableCell>{song.artist}</TableCell>
              <TableCell>Her Loss</TableCell>
              <TableCell className="capitalize">{song.status}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={() => setSelectedSong(song)}>
                  View Details
                </Button>
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