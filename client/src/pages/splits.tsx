import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Edit, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const splitFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  artist: z.string().min(1, "Artist is required"),
  songwriter: z.string().min(1, "Songwriter is required"),
  split: z.number().min(0).max(100, "Split must be between 0 and 100"),
  album: z.string().optional(),
});

type SplitFormValues = z.infer<typeof splitFormSchema>;

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
];

export default function SplitsPage() {
  const [selectedSplit, setSelectedSplit] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("songTitle");
  const { toast } = useToast();

  const form = useForm<SplitFormValues>({
    resolver: zodResolver(splitFormSchema),
    defaultValues: {
      title: "",
      artist: "",
      songwriter: "",
      split: 0,
      album: "",
    },
  });

  const onSubmit = async (data: SplitFormValues) => {
    try {
      await apiRequest("POST", "/api/splits", data);
      toast({
        title: "Split Created",
        description: "New split has been created successfully.",
      });
      form.reset();
      setEditDialogOpen(false);
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
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Split
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Split</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Song Title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter song title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="artist"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Artist</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter artist name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="songwriter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Songwriter</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter songwriter name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="split"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Split Percentage</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          placeholder="Enter split percentage" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="album"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Album (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter album name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-3 justify-end pt-4">
                  <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Split</Button>
                </div>
              </form>
            </Form>
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