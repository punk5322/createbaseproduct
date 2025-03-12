import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ChevronDown, ChevronUp, DollarSign } from "lucide-react";
import { Song } from "@shared/schema";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";

type SortField = "title" | "splitPercentage" | "numberOfSplits" | "status";
type SortOrder = "asc" | "desc";

interface CatalogTableProps {
  songs: Song[];
  isLoading: boolean;
  onSongClick: (song: Song) => void;
}

export default function CatalogTable({
  songs,
  isLoading,
  onSongClick,
}: CatalogTableProps) {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("title");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedSongs, setSelectedSongs] = useState<number[]>([]);
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  const filteredSongs = songs
    .filter((song) => {
      const matchesSearch = song.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || song.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const order = sortOrder === "asc" ? 1 : -1;
      switch (sortField) {
        case "title":
          return order * a.title.localeCompare(b.title);
        case "status":
          return order * (a.status || "").localeCompare(b.status || "");
        default:
          return 0;
      }
    });

  const SortIcon = sortOrder === "asc" ? ChevronUp : ChevronDown;

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleClaimRoyalties = () => {
    if (selectedSongs.length === 0) {
      return;
    }
    setLocation(`/checkout?songs=${selectedSongs.join(",")}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <div className="flex gap-4 flex-1">
          <Input
            placeholder="Search songs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Status: {statusFilter === "all" ? "All" : statusFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("unclaimed")}>
                Unclaimed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("claimed")}>
                Claimed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Button
          onClick={handleClaimRoyalties}
          disabled={selectedSongs.length === 0}
          className="flex items-center gap-2"
        >
          <DollarSign className="h-4 w-4" />
          Claim Royalties ({selectedSongs.length})
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Select</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("title")}
              >
                Title
                {sortField === "title" && <SortIcon className="inline ml-2" />}
              </TableHead>
              <TableHead>Artist</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("status")}
              >
                Status
                {sortField === "status" && <SortIcon className="inline ml-2" />}
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSongs.map((song) => (
              <TableRow key={song.id}>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedSongs.includes(song.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedSongs([...selectedSongs, song.id]);
                      } else {
                        setSelectedSongs(selectedSongs.filter(id => id !== song.id));
                      }
                    }}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </TableCell>
                <TableCell className="font-medium">{song.title}</TableCell>
                <TableCell>{song.artist}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      song.status === "claimed"
                        ? "bg-green-100 text-green-800"
                        : song.status === "unclaimed"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {song.status}
                  </span>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={() => onSongClick(song)}>
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}