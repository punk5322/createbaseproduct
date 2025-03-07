import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit2, Split } from "lucide-react";

export function SongDetails({ song, isOpen, onClose }) {
  const [editSplitsOpen, setEditSplitsOpen] = useState(false);
  const [conditionalSplitsOpen, setConditionalSplitsOpen] = useState(false);
  const [conditionalStep, setConditionalStep] = useState(1);
  const { toast } = useToast();

  const defaultContributors = [
    { name: "John Lennon", split: 40, proAffiliation: "ASCAP", publisher: "Northern Songs" },
    { name: "Paul McCartney", split: 40, proAffiliation: "ASCAP", publisher: "Northern Songs" },
    { name: "Camillo Felgen", split: 10, proAffiliation: "GEMA", publisher: "Sony Music" },
    { name: "Heinz Hellmer", split: 10, proAffiliation: "GEMA", publisher: "Sony Music" }
  ];

  const handleDelete = () => {
    toast({
      title: "Song Deleted",
      description: "The song has been removed from your catalog."
    });
    onClose();
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Song Details</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h3 className="font-medium">Title</h3>
              <p>{song?.title || "Unknown Title"}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Artists</h3>
              <p>{song?.artists?.join(", ") || "No artists"}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Release Date</h3>
              <p>{song?.releaseDate || "Not set"}</p>
            </div>
            <div className="flex flex-col gap-2 mt-6">
              <Button 
                variant="outline" 
                onClick={() => setEditSplitsOpen(true)}
                className="w-full justify-start text-left"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Splits
              </Button>
              <Button 
                variant="outline"
                onClick={() => setConditionalSplitsOpen(true)}
                className="w-full justify-start text-left"
              >
                <Split className="h-4 w-4 mr-2" />
                Add Conditional Split
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                className="w-full justify-start text-left"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Song
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={editSplitsOpen} onOpenChange={setEditSplitsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Splits</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {defaultContributors.map((contributor, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>{contributor.name}</Label>
                    <div className="text-sm text-muted-foreground">Songwriter</div>
                  </div>
                  <Input 
                    type="number" 
                    defaultValue={contributor.split} 
                    className="w-24" 
                    min="0"
                    max="100"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">PRO Affiliation</Label>
                    <Input defaultValue={contributor.proAffiliation} />
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Publisher</Label>
                    <Input defaultValue={contributor.publisher} />
                  </div>
                </div>
              </div>
            ))}
            <Button className="w-full" onClick={() => {
              setEditSplitsOpen(false);
              toast({
                title: "Splits Updated",
                description: "The split percentages have been updated successfully."
              });
            }}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog 
        open={conditionalSplitsOpen} 
        onOpenChange={(open) => {
          setConditionalSplitsOpen(open);
          if (!open) setConditionalStep(1);
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {conditionalStep === 1 && "Add Conditional Split"}
              {conditionalStep === 2 && "Define Condition"}
              {conditionalStep === 3 && "Pre-Threshold Split"}
              {conditionalStep === 4 && "Post-Condition Split"}
              {conditionalStep === 5 && "Review Conditional Split"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {conditionalStep === 1 && (
              <div className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start relative px-4 py-6"
                  onClick={() => setConditionalStep(2)}
                >
                  <div className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-0.5 rounded">
                    Selected
                  </div>
                  Recoupment-Based
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start px-4 py-6"
                >
                  Time-Based
                </Button>
              </div>
            )}

            {conditionalStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Threshold Amount ($)</Label>
                  <Input type="number" placeholder="Enter amount" defaultValue="750" />
                </div>
                <Button 
                  className="w-full"
                  onClick={() => setConditionalStep(3)}
                >
                  Next: Define Pre-Threshold Split
                </Button>
              </div>
            )}

            {conditionalStep === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  {defaultContributors.map((contributor, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <Label>{contributor.name}</Label>
                      <Input type="number" className="w-24" placeholder="%" defaultValue={contributor.split} />
                    </div>
                  ))}
                </div>
                <Button 
                  className="w-full"
                  onClick={() => setConditionalStep(4)}
                >
                  Next: Define Post-Threshold Split
                </Button>
              </div>
            )}

            {conditionalStep === 4 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  {defaultContributors.map((contributor, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <Label>{contributor.name}</Label>
                      <Input type="number" className="w-24" placeholder="%" defaultValue={contributor.split} />
                    </div>
                  ))}
                </div>
                <Button 
                  className="w-full"
                  onClick={() => setConditionalStep(5)}
                >
                  Next: Review
                </Button>
              </div>
            )}

            {conditionalStep === 5 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Pre-Threshold Split</h3>
                  <div className="h-8 bg-gradient-to-r from-green-500 to-red-500 rounded-full" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Condition</h3>
                  <p>When revenue reaches $750</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Post-Threshold Split</h3>
                  <div className="h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setConditionalStep(1)}
                  >
                    Edit
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={() => {
                      setConditionalSplitsOpen(false);
                      setConditionalStep(1);
                      toast({
                        title: "Conditional Split Added",
                        description: "The conditional split has been added successfully."
                      });
                    }}
                  >
                    Save and Apply
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}