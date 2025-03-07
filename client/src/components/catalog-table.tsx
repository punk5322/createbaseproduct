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
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { Song } from "@shared/schema";

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
      return a[sortField] > b[sortField] ? order : -order;
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

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
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
            <DropdownMenuItem onClick={() => setStatusFilter("intermediate")}>
              Intermediate
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("title")}
              >
                Title
                {sortField === "title" && <SortIcon className="inline ml-2" />}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("splitPercentage")}
              >
                Split %
                {sortField === "splitPercentage" && (
                  <SortIcon className="inline ml-2" />
                )}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("numberOfSplits")}
              >
                # of Splits
                {sortField === "numberOfSplits" && (
                  <SortIcon className="inline ml-2" />
                )}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("status")}
              >
                Status
                {sortField === "status" && <SortIcon className="inline ml-2" />}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSongs.map((song) => (
              <TableRow
                key={song.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onSongClick(song)}
              >
                <TableCell>{song.title}</TableCell>
                <TableCell>{song.splitPercentage}%</TableCell>
                <TableCell>{song.numberOfSplits}</TableCell>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
