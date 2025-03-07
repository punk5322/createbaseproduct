import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AddSongSheet() {
  const { toast } = useToast();
  const [streamingLinks, setStreamingLinks] = useState<string[]>([""]);
  const [songTitle, setSongTitle] = useState("");
  const [writerName, setWriterName] = useState("");
  const [open, setOpen] = useState(false);

  const addSongMutation = useMutation({
    mutationFn: async (data: { title: string; artist: string }) => {
      const res = await apiRequest("POST", "/api/songs", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/songs"] });
      setOpen(false);
      toast({
        title: "Song Added",
        description: "The song has been added to your catalog",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to add song",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAddStreamingLink = () => {
    setStreamingLinks([...streamingLinks, ""]);
  };

  const handleStreamingLinkChange = (index: number, value: string) => {
    const newLinks = [...streamingLinks];
    newLinks[index] = value;
    setStreamingLinks(newLinks);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSongMutation.mutate({
      title: songTitle,
      artist: writerName,
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>Add Songs</Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Add Streaming Links</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="space-y-4">
            {streamingLinks.map((link, index) => (
              <Input
                key={index}
                placeholder="Add Streaming Link"
                value={link}
                onChange={(e) => handleStreamingLinkChange(index, e.target.value)}
              />
            ))}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleAddStreamingLink}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Link
            </Button>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Add Song</h3>
            <div className="space-y-4">
              <Input
                placeholder="Add Song"
                value={songTitle}
                onChange={(e) => setSongTitle(e.target.value)}
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Writer Name</h3>
            <div className="space-y-4">
              <Input
                placeholder="Choose Name"
                value={writerName}
                onChange={(e) => setWriterName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <Button type="submit" className="w-full" disabled={addSongMutation.isPending}>
              Add To Catalog
            </Button>
            <Button type="button" variant="outline" className="w-full" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
