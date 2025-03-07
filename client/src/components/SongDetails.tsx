import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit } from "lucide-react";

export function SongDetails({ song, isOpen, onClose }) {
  const [editSplitsOpen, setEditSplitsOpen] = useState(false);
  const [conditionalSplitsOpen, setConditionalSplitsOpen] = useState(false);
  const [conditionalStep, setConditionalStep] = useState(1);
  const { toast } = useToast();

  const handleDelete = () => {
    // Handle delete logic
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
              <p>{song?.title}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Artists</h3>
              <p>{song?.artists?.join(", ")}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Release Date</h3>
              <p>{song?.releaseDate}</p>
            </div>
            <div className="flex gap-2 mt-6">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setEditSplitsOpen(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Splits
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setConditionalSplitsOpen(true)}
              >
                Add Conditional Split
              </Button>
              <Button 
                variant="destructive" 
                size="icon"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit Splits Modal */}
      <Dialog open={editSplitsOpen} onOpenChange={setEditSplitsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Splits</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-4">
              {song?.contributors?.map((contributor, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>{contributor.name}</Label>
                    <Input 
                      type="number" 
                      value={contributor.split} 
                      className="w-24" 
                      min="0"
                      max="100"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm text-muted-foreground">PRO Affiliation</Label>
                    <Input value={contributor.proAffiliation} className="flex-1" />
                  </div>
                </div>
              ))}
            </div>
            <Button 
              className="w-full"
              onClick={() => {
                setEditSplitsOpen(false);
                toast({
                  title: "Splits Updated",
                  description: "The split percentages have been updated successfully."
                });
              }}
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Conditional Splits Modal */}
      <Dialog open={conditionalSplitsOpen} onOpenChange={setConditionalSplitsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {conditionalStep === 1 && "Add Conditional Split"}
              {conditionalStep === 2 && "Define Condition"}
              {conditionalStep === 3 && "Pre-Threshold Split"}
              {conditionalStep === 4 && "Post-Condition Split"}
              {conditionalStep === 5 && "Review Conditional Split"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {conditionalStep === 1 && (
              <div className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setConditionalStep(2)}
                >
                  Recoupment-Based
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setConditionalStep(2)}
                >
                  Time-Based
                </Button>
              </div>
            )}

            {conditionalStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Threshold Amount ($)</Label>
                  <Input type="number" placeholder="Enter amount" />
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
                  {song?.contributors?.map((contributor, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <Label>{contributor.name}</Label>
                      <Input type="number" className="w-24" placeholder="%" />
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
                  {song?.contributors?.map((contributor, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <Label>{contributor.name}</Label>
                      <Input type="number" className="w-24" placeholder="%" />
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
                  {/* Display pre-threshold splits */}
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Condition</h3>
                  <p>When revenue reaches $X</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Post-Threshold Split</h3>
                  {/* Display post-threshold splits */}
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
