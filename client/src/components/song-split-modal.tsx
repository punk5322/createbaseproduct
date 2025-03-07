import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Song } from "@shared/schema";
import SplitVisualization from "./split-visualization";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface SongSplitModalProps {
  song: Song | null;
  onClose: () => void;
}

export default function SongSplitModal({ song, onClose }: SongSplitModalProps) {
  const { toast } = useToast();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!song) return;
      await apiRequest("DELETE", `/api/songs/${song.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/songs"] });
      toast({
        title: "Song deleted",
        description: "The song has been removed from your catalog",
      });
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (!song) return null;

  const musicSplit = JSON.parse(song.musicSplit);
  const lyricsSplit = JSON.parse(song.lyricsSplit);
  const instrumentalSplit = JSON.parse(song.instrumentalSplit);

  return (
    <Sheet open={Boolean(song)} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{song.title}</SheetTitle>
        </SheetHeader>

        <div className="py-6 space-y-6">
          <div>
            <h3 className="font-medium mb-2">Music Split</h3>
            <SplitVisualization data={musicSplit} />
          </div>

          <div>
            <h3 className="font-medium mb-2">Lyrics Split</h3>
            <SplitVisualization data={lyricsSplit} />
          </div>

          <div>
            <h3 className="font-medium mb-2">Instrumental Split</h3>
            <SplitVisualization data={instrumentalSplit} />
          </div>

          <div className="flex gap-4 pt-4">
            <Button variant="outline" onClick={() => {}}>
              Edit Splits
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Song</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Song</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this song? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteMutation.mutate()}
                    className="bg-destructive text-destructive-foreground"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
