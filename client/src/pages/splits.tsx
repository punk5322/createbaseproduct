import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Edit, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

// Mock data for initial display
const mockSplits = [
  {
    id: 1,
    songTitle: "Rich Flex",
    artist: "Drake & 21 Savage",
    contributors: [
      { name: "Drake", role: "Artist/Writer", share: 40 },
      { name: "21 Savage", role: "Artist/Writer", share: 40 },
      { name: "Producer", role: "Producer", share: 20 }
    ],
    totalShare: 100,
    status: "Active"
  },
  // Add more mock data as needed
];

export default function SplitsPage() {
  const [selectedSplit, setSelectedSplit] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("songTitle");

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Splits Management</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Split
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Split</DialogTitle>
            </DialogHeader>
            {/* Add split creation form here */}
          </DialogContent>
        </Dialog>
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
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSplits.map((split) => (
                <TableRow key={split.id}>
                  <TableCell>{split.songTitle}</TableCell>
                  <TableCell>{split.artist}</TableCell>
                  <TableCell>
                    {split.contributors.map((c) => c.name).join(", ")}
                  </TableCell>
                  <TableCell>{split.totalShare}%</TableCell>
                  <TableCell>{split.status}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedSplit(split);
                        setEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Edit Split Details</DialogTitle>
          </DialogHeader>
          {selectedSplit && (
            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Song Title</Label>
                  <Input defaultValue={selectedSplit.songTitle} className="mt-2" />
                </div>
                <div>
                  <Label>Artist</Label>
                  <Input defaultValue={selectedSplit.artist} className="mt-2" />
                </div>
              </div>
              
              <div>
                <Label>Contributors</Label>
                <div className="mt-2 space-y-4">
                  {selectedSplit.contributors.map((contributor, index) => (
                    <div key={index} className="grid grid-cols-3 gap-4">
                      <Input defaultValue={contributor.name} placeholder="Name" />
                      <Input defaultValue={contributor.role} placeholder="Role" />
                      <Input 
                        type="number" 
                        defaultValue={contributor.share} 
                        placeholder="Share %" 
                      />
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Contributor
                  </Button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button className="flex-1">Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
