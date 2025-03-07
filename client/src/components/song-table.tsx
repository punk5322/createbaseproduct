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
    if (!song.splitData) return 0;
    return (
      song.splitData.music.length +
      song.splitData.lyrics.length +
      song.splitData.instruments.length
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
  );
}